import { Request, Response } from "express";
import { handleUpdateGrowthLevels } from "../controllers/handleUpdateGrowthLevels";
import { Visitor, DroppedAsset } from "../utils/topiaInit";

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
          growLevel: 1,
          position: { x: 10, y: 10 },
          wasHarvested: false,
        },
        "plant-2": {
          id: "plant-2",
          seedType: "carrot",
          dateDropped: Date.now() - 900000, // 15 minutes ago
          growLevel: 2,
          position: { x: 20, y: 20 },
          wasHarvested: false,
        },
      },
    };
  }),
}));

jest.mock("../utils/growth/calculateGrowthLevel", () => ({
  updateGrowthLevels: jest.fn().mockImplementation((plants) => {
    // Simulate growth level updates
    const updatedPlants = { ...plants };
    if (updatedPlants["plant-1"]) {
      updatedPlants["plant-1"] = {
        ...updatedPlants["plant-1"],
        growLevel: 2, // Increased from 1 to 2
      };
    }
    if (updatedPlants["plant-2"]) {
      updatedPlants["plant-2"] = {
        ...updatedPlants["plant-2"],
        growLevel: 3, // Increased from 2 to 3
      };
    }
    return updatedPlants;
  }),
}));

// Mock visitor
const mockVisitor = {
  updateDataObject: jest.fn().mockResolvedValue(true),
};

// Mock dropped asset
const mockDroppedAsset = {
  updateDataObject: jest.fn().mockResolvedValue(true),
};

// Mock Visitor.get to return mockVisitor
jest.mock("../utils/topiaInit", () => ({
  Visitor: {
    get: jest.fn().mockResolvedValue(mockVisitor),
  },
  DroppedAsset: {
    get: jest.fn().mockResolvedValue(mockDroppedAsset),
  },
}));

describe("handleUpdateGrowthLevels", () => {
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

  it("should update growth levels for plants", async () => {
    await handleUpdateGrowthLevels(mockRequest as Request, mockResponse as Response);

    // Check that Visitor.get was called with the correct params
    expect(Visitor.get).toHaveBeenCalledWith("test-visitor-id", "test-world", {
      credentials: { urlSlug: "test-world", visitorId: "test-visitor-id" },
    });

    // Check that updateDataObject was called with updated plants
    expect(mockVisitor.updateDataObject).toHaveBeenCalledWith(
      {
        plants: expect.objectContaining({
          "plant-1": expect.objectContaining({ growLevel: 2 }),
          "plant-2": expect.objectContaining({ growLevel: 3 }),
        }),
      },
      {
        analytics: [{ analyticName: "plantsGrown", uniqueKey: "test-visitor-id" }],
      },
    );

    // Check that DroppedAsset.get was called for each updated plant
    expect(DroppedAsset.get).toHaveBeenCalledWith("plant-1", "test-world", {
      credentials: { urlSlug: "test-world", visitorId: "test-visitor-id" },
    });

    expect(DroppedAsset.get).toHaveBeenCalledWith("plant-2", "test-world", {
      credentials: { urlSlug: "test-world", visitorId: "test-visitor-id" },
    });

    // Check that each dropped asset's data object was updated
    expect(mockDroppedAsset.updateDataObject).toHaveBeenCalledTimes(2);
    expect(mockDroppedAsset.updateDataObject).toHaveBeenCalledWith(
      expect.objectContaining({
        growLevel: expect.any(Number),
        lastUpdated: expect.any(String),
      }),
      {
        analytics: [
          {
            analyticName: "plantGrowthUpdated",
            uniqueKey: "test-visitor-id",
          },
        ],
      },
    );

    // Check the response
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      updatedPlants: expect.arrayContaining([
        expect.objectContaining({
          id: "plant-1",
          previousLevel: 1,
          newLevel: 2,
        }),
        expect.objectContaining({
          id: "plant-2",
          previousLevel: 2,
          newLevel: 3,
        }),
      ]),
    });
  });
});
