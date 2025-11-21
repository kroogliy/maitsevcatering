import mongoose from "mongoose";
// asas
export function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.MONGODB_URI;
    const fallbackUri = process.env.MONGODB_URI_FALLBACK;

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const connectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    return mongoose
      .connect(uri, connectOptions)
      .then(() => {
        // MongoDB connected successfully
      })
      .catch(async (error) => {
        // MongoDB primary connection error

        // Try fallback connection if available
        if (
          (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") &&
          fallbackUri
        ) {
          try {
            // Trying fallback MongoDB connection
            await mongoose.connect(fallbackUri, {
              ...connectOptions,
              authSource: "admin",
              ssl: true,
            });
            // MongoDB fallback connection successful
          } catch (fallbackError) {
            // MongoDB fallback connection also failed
            throw error; // Throw original error
          }
        } else {
          throw error;
        }
      });
  }
}
