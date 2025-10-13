package com.vendor.forge.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.database.Cursor;
import android.provider.OpenableColumns;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class DocumentPickerModule extends ReactContextBaseJavaModule {
    private static final int PICK_DOCUMENT_REQUEST = 1001;
    private Promise documentPickerPromise;

    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == PICK_DOCUMENT_REQUEST) {
                if (documentPickerPromise != null) {
                    if (resultCode == Activity.RESULT_OK && intent != null) {
                        Uri uri = intent.getData();
                        if (uri != null) {
                            try {
                                WritableMap result = Arguments.createMap();
                                result.putString("uri", uri.toString());

                                // Get file name and size
                                Cursor cursor = getReactApplicationContext().getContentResolver().query(uri, null, null,
                                        null, null);
                                if (cursor != null && cursor.moveToFirst()) {
                                    int nameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                                    int sizeIndex = cursor.getColumnIndex(OpenableColumns.SIZE);

                                    if (nameIndex != -1) {
                                        result.putString("name", cursor.getString(nameIndex));
                                    }
                                    if (sizeIndex != -1) {
                                        result.putInt("size", cursor.getInt(sizeIndex));
                                    }
                                    cursor.close();
                                }

                                result.putString("type", "application/pdf");
                                documentPickerPromise.resolve(result);
                            } catch (Exception e) {
                                documentPickerPromise.reject("DOCUMENT_PICKER_ERROR", e.getMessage());
                            }
                        } else {
                            documentPickerPromise.reject("DOCUMENT_PICKER_ERROR", "No file selected");
                        }
                    } else {
                        documentPickerPromise.reject("DOCUMENT_PICKER_CANCELLED", "User cancelled");
                    }
                    documentPickerPromise = null;
                }
            }
        }
    };

    public DocumentPickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(activityEventListener);
    }

    @Override
    public String getName() {
        return "DocumentPickerModule";
    }

    @ReactMethod
    public void pickDocument(Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject("ACTIVITY_NOT_FOUND", "Activity not found");
            return;
        }

        documentPickerPromise = promise;

        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("application/pdf");
        intent.addCategory(Intent.CATEGORY_OPENABLE);

        try {
            currentActivity.startActivityForResult(Intent.createChooser(intent, "Select PDF"), PICK_DOCUMENT_REQUEST);
        } catch (Exception e) {
            promise.reject("DOCUMENT_PICKER_ERROR", e.getMessage());
            documentPickerPromise = null;
        }
    }
}

