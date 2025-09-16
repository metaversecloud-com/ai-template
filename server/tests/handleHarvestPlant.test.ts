import { Request, Response } from "express";
import { handleHarvestPlant } from "../controllers/handleHarvestPlant";
import { DroppedAsset, Visitor, World } from "../utils/topiaInit";

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
      coinsAvailable: 100,
      totalCoinsEarned: 100,
      unlockedSeeds: ["tomato", "carrot", "corn"],
      plants: {
        "plant-1": {
          id: "plant-1",
          seedId: "tomato",
          dateDropped: new Date(Date.now() - 1000000).toISOString(),
          growLevel: 10, // Fully grown
          wasHarvested: false,
          lastUpdated: new Date(Date.now() - 100000).toISOString(),
        },
      },
    };
  }),
}));

jest.mock("../utils/seedData", () => ({
  getSeedById: jest.fn().mockImplementation((seedId) => {
    if (seedId === "tomato") {
      return {
        id: "tomato",
        name: "Tomato",
        description: "A juicy red tomato",
        cost: 10,
        reward: 20,
        growthTime: 300000, // 5 minutes
        imageUrl: "tomato.png",
        unlockedByDefault: true,
      };
    }
    return null;
  }),
}));

// Mock objects
const mockVisitor = {
  updateDataObject: jest.fn().mockResolvedValue(true),
};

const mockWorld = {
  triggerParticle: jest.fn().mockResolvedValue(true),
};

const mockDroppedAsset = {
  position: { x: 100, y: 100 },
  incrementDataObjectValue: jest.fn().mockResolvedValue(true),
  updateDataObject: jest.fn().mockResolvedValue(true),
};

// Mock SDK classes
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

describe("handleHarvestPlant", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    mockRequest = {
      query: {},
      body: {
        plantId: "plant-1",
      },
    };
    mockResponse = {
      json: jsonMock,
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should harvest a plant and track analytics", async () => {
    await handleHarvestPlant(mockRequest as Request, mockResponse as Response);

    // Check that World.create was called with the correct params
    expect(World.create).toHaveBeenCalledWith("test-world", {
      credentials: expect.objectContaining({ urlSlug: "test-world" }),
    });

    // Check that Visitor.get was called with the correct params
    expect(Visitor.get).toHaveBeenCalledWith("test-visitor-id", "test-world", {
      credentials: expect.objectContaining({ urlSlug: "test-world" }),
    });

    // Check that DroppedAsset.get was called with the correct params
    expect(DroppedAsset.get).toHaveBeenCalledWith("plant-1", "test-world", {
      credentials: expect.objectContaining({ urlSlug: "test-world" }),
    });

    // Check that incrementDataObjectValue was called for analytics
    expect(mockDroppedAsset.incrementDataObjectValue).toHaveBeenCalledWith("harvestCount", 1, {
      analytics: [{ analyticName: "plantsHarvested", uniqueKey: "test-visitor-id" }],
    });

    // Check that updateDataObject was called for the dropped asset
    expect(mockDroppedAsset.updateDataObject).toHaveBeenCalledWith(
      expect.objectContaining({
        wasHarvested: true,
        harvestedAt: expect.any(String),
        reward: 20,
      }),
      {
        analytics: [{ analyticName: "rewards", uniqueKey: "test-visitor-id" }],
      },
    );

    // Check that triggerParticle was called
    expect(mockWorld.triggerParticle).toHaveBeenCalledWith({
      name: "Sparkle",
      duration: 5,
      position: { x: 100, y: 100 },
    });

    // Check that visitor updateDataObject was called with correct data
    expect(mockVisitor.updateDataObject).toHaveBeenCalledWith(
      expect.objectContaining({
        totalCoinsEarned: 120, // 100 + 20 (reward)
        coinsAvailable: 120, // 100 + 20 (reward)
        plants: expect.objectContaining({
          "plant-1": expect.objectContaining({
            wasHarvested: true,
          }),
        }),
      }),
    );

    // Check the response
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        reward: 20,
      }),
    );
  });
});
