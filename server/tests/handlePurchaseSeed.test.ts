import { Request, Response } from "express";
import { handlePurchaseSeed } from "../controllers/handlePurchaseSeed";
import { Visitor, World } from "../utils/topiaInit";

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
      unlockedSeeds: ["tomato", "carrot"],
      plants: {},
    };
  }),
}));

jest.mock("../utils/seedData", () => ({
  getSeedById: jest.fn().mockImplementation((seedId: string) => {
    if (seedId === "strawberry") {
      return {
        id: "strawberry",
        name: "Strawberry",
        description: "A sweet strawberry",
        cost: 50,
        reward: 75,
        growthTime: 600000, // 10 minutes
        imageUrl: "strawberry.png",
        unlockedByDefault: false,
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
  fireToast: jest.fn().mockResolvedValue(true),
};

// Mock SDK classes
jest.mock("../utils/topiaInit", () => ({
  Visitor: {
    get: jest.fn().mockResolvedValue(mockVisitor),
  },
  World: {
    create: jest.fn().mockReturnValue(mockWorld),
  },
}));

describe("handlePurchaseSeed", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    mockRequest = {
      query: {},
      body: {
        seedId: "strawberry",
      },
    };
    mockResponse = {
      json: jsonMock,
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should purchase a seed and track analytics", async () => {
    await handlePurchaseSeed(mockRequest as Request, mockResponse as Response);

    // Check that World.create was called with the correct params
    expect(World.create).toHaveBeenCalledWith("test-world", {
      credentials: expect.objectContaining({ urlSlug: "test-world" }),
    });

    // Check that Visitor.get was called with the correct params
    expect(Visitor.get).toHaveBeenCalledWith("test-visitor-id", "test-world", {
      credentials: expect.objectContaining({ urlSlug: "test-world" }),
    });

    // Check that visitor updateDataObject was called with correct data and analytics
    expect(mockVisitor.updateDataObject).toHaveBeenCalledWith(
      expect.objectContaining({
        coinsAvailable: 50, // 100 - 50 (cost)
        unlockedSeeds: ["tomato", "carrot", "strawberry"],
      }),
      {
        analytics: [{ analyticName: "seedsPurchased", uniqueKey: "test-visitor-id" }],
      },
    );

    // Check that fireToast was called
    expect(mockWorld.fireToast).toHaveBeenCalledWith({
      title: "Seed Purchased!",
      text: expect.stringContaining("Strawberry"),
    });

    // Check the response
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        seedId: "strawberry",
        visitorData: expect.objectContaining({
          coinsAvailable: 50,
          unlockedSeeds: ["tomato", "carrot", "strawberry"],
        }),
      }),
    );
  });
});
