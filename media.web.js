import { mediaManager } from "wix-media-backend";

export async function getDownloadUrl(fileUrl) {
  try {
    const url = await mediaManager.getDownloadUrl(fileUrl);

    return {
      success: true,
      url,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}
