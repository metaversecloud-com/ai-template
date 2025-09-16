import { Request, Response } from "express";
import { handleRemoveAllPlants } from "../controllers/handleRemoveAllPlants";
import { Visitor, World, DroppedAsset } from "../utils/topiaInit";

// Mock the required utilities
jest.mock("../utils/errorHandler", () => ({
  errorHandler: jest.fn().mockImplementation((params) => {
    return params.res.status(500).json({
      success: false,
      error: params.error.toString(),
      message: params.message,
    });
  }),
}));

jest.mock("../utils/getCredentials", () => ({
  getCredentials: jest.fn().mockReturnValue({
    urlSlug: "test-world",
    visitorId: "test-visitor-id",
  }),
}));

jest.mock("../utils/initializeVisitorDataObject", () => ({
  initializeVisitorDataObject: jest.fn().mockImplementation(async (visitor) => {
    return {
      coins: 100,
      unlockedSeeds: ["tomato", "carrot", "corn"],
      plants: {
        "plant-1": {
          id: "plant-1",
          seedType: "tomato",
          dateDropped: Date.now() - 300000, // 5 minutes ago
          growLevel: 2,
          position: { x: 10, y: 10 },
          wasHarvested: false,
        },
        "plant-2": {
          id: "plant-2",
          seedType: "carrot",
          dateDropped: Date.now() - 900000, // 15 minutes ago
          growLevel: 3,
          position: { x: 20, y: 20 },
          wasHarvested: false,
        },
      },
    };
  }),
}));

// Mock visitor and world
const mockVisitor = {
  updateDataObject: jest.fn().mockResolvedValue(true),
};

const mockWorld = {
  fireToast: jest.fn().mockResolvedValue(true),
};

// Mock dropped asset
const mockDroppedAsset = {
  updateDataObject: jest.fn().mockResolvedValue(true),
};

// Mock Visitor.get and World.create
jest.mock("../utils/topiaInit", () => ({
  Visitor: {
    get: jest.fn().mockResolvedValue(mockVisitor),
  },
  World: {
    create: jest.fn().mockReturnValue(mockWorld),
  },
  DroppedAsset: {
    get: jest.fn().mockResolvedValue(mockDroppedAsset),
  },
}));

describe("handleRemoveAllPlants", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    mockRequest = {
      query: {},
    };
    mockResponse = {
      json: jsonMock,
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should remove all plants", async () => {
    await handleRemoveAllPlants(mockRequest as Request, mockResponse as Response);

    // Check that World.create was called with the correct params
    expect(World.create).toHaveBeenCalledWith("test-world", {
      credentials: { urlSlug: "test-world", visitorId: "test-visitor-id" },
    });

    // Check that Visitor.get was called with the correct params
    expect(Visitor.get).toHaveBeenCalledWith("test-visitor-id", "test-world", {
      credentials: { urlSlug: "test-world", visitorId: "test-visitor-id" },
    });

    // Check that updateDataObject was called to clear plants
    expect(mockVisitor.updateDataObject).toHaveBeenCalledWith(
      {
        plants: {},
      },
      {
        analytics: [
          {
            analyticName: "gardenCleared",
            uniqueKey: "test-visitor-id",
          },
        ],
      },
    );

    // Check that DroppedAsset.get was called for each plant
    expect(DroppedAsset.get).toHaveBeenCalledWith(expect.stringContaining("plant-"), "test-world", {
      credentials: { urlSlug: "test-world", visitorId: "test-visitor-id" },
    });

    // Check that each dropped asset's data object was updated
    expect(mockDroppedAsset.updateDataObject).toHaveBeenCalledWith(
      expect.objectContaining({
        wasRemoved: true,
        removedAt: expect.any(String),
      }),
      {
        analytics: [
          {
            analyticName: "plantsRemoved",
            uniqueKey: "test-visitor-id",
          },
        ],
      },
    );

    // Check that fireToast was called
    expect(mockWorld.fireToast).toHaveBeenCalledWith({
      title: "Garden Cleared",
      text: expect.stringContaining("plants have been removed"),
    });

    // Check the response
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: expect.stringContaining("Successfully removed"),
      removedCount: expect.any(Number),
    });
  });
});
