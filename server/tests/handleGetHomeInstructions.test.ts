import { Request, Response } from "express";
import { handleGetHomeInstructions } from "../controllers/handleGetHomeInstructions";

describe("handleGetHomeInstructions", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const jsonMock = jest.fn();

  beforeEach(() => {
    mockRequest = {
      query: {
        profileId: "test-profile-id",
        displayName: "Test User",
        urlSlug: "test-world",
        visitorId: "test-visitor-id",
        assetId: "test-asset-id",
        sceneDropId: "test-scene-drop-id",
        interactiveNonce: "test-nonce",
        interactivePublicKey: "test-public-key",
      },
    };

    mockResponse = {
      json: jsonMock,
      status: jest.fn().mockReturnThis(),
    };

    jsonMock.mockClear();
  });

  it("should return instructions with success true", async () => {
    await handleGetHomeInstructions(mockRequest as Request, mockResponse as Response);

    expect(jsonMock).toHaveBeenCalledTimes(1);
    const response = jsonMock.mock.calls[0][0];

    expect(response).toHaveProperty("success", true);
    expect(response).toHaveProperty("data");
    expect(typeof response.data).toBe("string");
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data).toContain("Welcome to the Virtual Garden");
  });
});
