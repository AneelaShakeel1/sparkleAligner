import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import treatmentpreviewReducer from "./treatmentpreview/treatmentpreviewSlice";
import treatmentpreviewByAgentReducer from './treatmentPreviewByAgent/treatmentPreviewByAgentSlice'
import manufacturerReducer from "./manufacturer/manufacturerSlice";
const rootReducer = combineReducers({
  user: userReducer,
  treatmentpreview:treatmentpreviewReducer,
  manufacturer:manufacturerReducer,
  treatmentpreviewbyagent:treatmentpreviewByAgentReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
