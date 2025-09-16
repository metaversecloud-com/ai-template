import { Request, Response } from "express";
import { handlePlantSeed } from "../controllers/handlePlantSeed";
import { Asset, DroppedAsset, Visitor, World } from "../utils/topiaInit";

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
    interactivePublicKey: "test-key",
  }),
}));

jest.mock("../utils/initializeVisitorDataObject", () => ({
  initializeVisitorDataObject: jest.fn().mockImplementation(async (visitor) => {
    return {
      coinsAvailable: 100,
      totalCoinsEarned: 100,
      unlockedSeeds: ["tomato", "carrot", "corn"],
      plants: {},
    };
  }),
}));

jest.mock("../utils/seedData", () => ({
  getSeedById: jest.fn().mockImplementation((seedId: string) => {
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
  SEEDS: [
    {
      id: "tomato",
      name: "Tomato",
      description: "A juicy red tomato",
      cost: 10,
      reward: 20,
      growthTime: 300000, // 5 minutes
      imageUrl: "tomato.png",
      unlockedByDefault: true,
    },
  ],
}));

// Mock objects
const mockVisitor = {
  updateDataObject: jest.fn().mockResolvedValue(true),
};

const mockWorld = {
  fireToast: jest.fn().mockResolvedValue(true),
};

const mockDroppedAsset = {
  id: "dropped-asset-id-123",
  setDataObject: jest.fn().mockResolvedValue(true),
};

const mockAsset = {};

// Mock SDK classes
jest.mock("../utils/topiaInit", () => ({
  Visitor: {
    get: jest.fn().mockResolvedValue(mockVisitor),
  },
  World: {
    create: jest.fn().mockReturnValue(mockWorld),
  },
  DroppedAsset: {
    drop: jest.fn().mockResolvedValue(mockDroppedAsset),
  },
  Asset: {
    create: jest.fn().mockReturnValue(mockAsset),
  },
}));

describe("handlePlantSeed", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    mockRequest = {
      query: {},
      body: {
        seedId: "tomato",
        position: { x: 100, y: 100 },
      },
    };
    mockResponse = {
      json: jsonMock,
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should plant a seed and track analytics", async () => {
    await handlePlantSeed(mockRequest as Request, mockResponse as Response);

    // Check that World.create was called with the correct params
    expect(World.create).toHaveBeenCalledWith("test-world", {
      credentials: expect.objectContaining({ urlSlug: "test-world" }),
    });

    // Check that Visitor.get was called with the correct params
    expect(Visitor.get).toHaveBeenCalledWith("test-visitor-id", "test-world", {
      credentials: expect.objectContaining({ urlSlug: "test-world" }),
    });

    // Check that Asset.create was called
    expect(Asset.create).toHaveBeenCalledWith("webImageAsset", expect.any(Object));

    // Check that DroppedAsset.drop was called with the correct params
    expect(DroppedAsset.drop).toHaveBeenCalledWith(
      mockAsset,
      expect.objectContaining({
        isInteractive: false,
        interactivePublicKey: "test-key",
        position: { x: 100, y: 100 },
        urlSlug: "test-world",
      }),
    );

    // Check that setDataObject was called with the correct analytics
    expect(mockDroppedAsset.setDataObject).toHaveBeenCalledWith(
      expect.objectContaining({
        seedId: "tomato",
        dateDropped: expect.any(String),
        growLevel: 0,
      }),
      {
        analytics: [{ analyticName: "seedsPlanted", uniqueKey: "test-visitor-id" }],
      },
    );

    // Check that visitor updateDataObject was called with correct data
    expect(mockVisitor.updateDataObject).toHaveBeenCalledWith(
      expect.objectContaining({
        coinsAvailable: 90, // 100 - 10 (cost of tomato)
        plants: expect.objectContaining({
          "dropped-asset-id-123": expect.objectContaining({
            seedId: "tomato",
            growLevel: 0,
            wasHarvested: false,
          }),
        }),
      }),
    );

    // Check the response
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
      }),
    );
  });
});
