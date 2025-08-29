package com.wrotiretail.app

import android.app.Activity
import android.content.IntentSender
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.UpdateAvailability
import com.google.android.play.core.tasks.OnSuccessListener

class InAppUpdateModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val reactContext = reactContext
    private val appUpdateManager: AppUpdateManager =
        AppUpdateManagerFactory.create(reactContext)
    private val MY_REQUEST_CODE = 1234

    override fun getName(): String {
        return "InAppUpdate"
    }

    @ReactMethod
    fun checkUpdate(promise: Promise) {
        val appUpdateInfoTask: com.google.android.play.core.tasks.Task<AppUpdateInfo> =
            appUpdateManager.appUpdateInfo

        appUpdateInfoTask.addOnSuccessListener(OnSuccessListener<AppUpdateInfo> { appUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE) {
                val activity: Activity? = currentActivity
                if (activity != null) {
                    try {
                        appUpdateManager.startUpdateFlowForResult(
                            appUpdateInfo,
                            AppUpdateType.IMMEDIATE,
                            activity,
                            MY_REQUEST_CODE
                        )
                        promise.resolve("Update started")
                    } catch (e: IntentSender.SendIntentException) {
                        e.printStackTrace()
                        promise.reject("UPDATE_ERROR", e)
                    }
                } else {
                    promise.reject("NO_ACTIVITY", "Current activity is null")
                }
            } else {
                promise.resolve("No update available")
            }
        })

        appUpdateInfoTask.addOnFailureListener { exception ->
            promise.reject("UPDATE_CHECK_FAILED", exception)
        }
    }
}
