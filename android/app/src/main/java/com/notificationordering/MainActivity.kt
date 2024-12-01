package com.notificationordering

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.ContentResolver
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.core.app.NotificationCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "NotificationOrdering"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val notificationChannel = NotificationChannel(
        "sound_channel_p1",
        "notificationordering",
        NotificationManager.IMPORTANCE_HIGH
      )
      notificationChannel.setShowBadge(true)
      notificationChannel.description = ""
      val att = AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)

        .build()
      notificationChannel.setSound(
        Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/linging_phone"),
        att
      )
      notificationChannel.enableVibration(true)
      notificationChannel.vibrationPattern = longArrayOf(400, 400)
      notificationChannel.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
      val manager = getSystemService(NotificationManager::class.java)
      manager.createNotificationChannel(notificationChannel)
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val notificationChannel = NotificationChannel(
        "sound_channel",
        "{App_N}",
        NotificationManager.IMPORTANCE_HIGH
      )
      notificationChannel.setShowBadge(true)
      notificationChannel.description = ""
      val att = AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_NOTIFICATION)
        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
        .build()
      notificationChannel.setSound(
        Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + packageName + "/raw/mix_noti"),
        att
      )
      notificationChannel.enableVibration(true)
      notificationChannel.vibrationPattern = longArrayOf(400, 400)
      notificationChannel.lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
      val manager = getSystemService(NotificationManager::class.java)
      manager.createNotificationChannel(notificationChannel)
    }
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}