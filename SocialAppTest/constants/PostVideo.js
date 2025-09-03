import React, { useState, useRef, useEffect } from "react";
import { View, Pressable, StyleSheet, Animated } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Video as ExpoAVVideo } from "expo-av";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getSupabaseFileUrl } from "../services/imageService";
import { theme } from "./Theme";

const PostVideo = ({ file, style }) => {
  const [useFallback, setUseFallback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const avRef = useRef(null);

  if (!file) return null;

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const uri = getSupabaseFileUrl(file)?.uri;

  // expo-video setup
  let player;
  try {
    player = useVideoPlayer({ uri, type: "mp4" }, (p) => {
      p.loop = true;
    });
  } catch (e) {
    console.warn("expo-video init failed, falling back:", e);
    setUseFallback(true);
  }

  const togglePlay = async () => {
    if (useFallback && avRef.current) {
      const status = await avRef.current.getStatusAsync();
      if (status.isPlaying) {
        await avRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await avRef.current.playAsync();
        setIsPlaying(true);
      }
    } else if (player) {
      if (isPlaying) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isPlaying ? 0 : 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [isPlaying]);

  return (
    <View style={[style, { position: "relative", borderRadius: theme.radius.xl }]}>
      {!useFallback ? (
        <VideoView
          player={player}
          contentFit="cover"
          nativeControls = {true}
          style={{ flex: 1 }}
          onError={(err) => {
            console.warn("expo-video error, falling back:", err);
            setUseFallback(true);
          }}
        />
      ) : (
        <ExpoAVVideo
          ref={avRef}
          source={{ uri }}
          style={{ flex: 1 }}
          resizeMode="cover"
          isLooping
        />
      )}

      {/* Overlay Play/Pause Button */}
        
            {/* <Pressable style={styles.buttonWrapper} onPress={togglePlay}>
                <Animated.View style={{ opacity: fadeAnim }}> 
                    <Icon
                    name={isPlaying ? "pause" : "play-arrow"}
                    size={70}
                    color="white"
                />
                </Animated.View>  
            </Pressable>

            <Pressable 
                style={styles.fullscreenButton}
                onPress={() => {
                    if (useFallback && avRef.current?.presentFullscreenPlayer) {
                    avRef.current.presentFullscreenPlayer();
                    } else if (player?.enterFullscreen) {
                    player.enterFullscreen();
                    } else {
                    console.warn("Fullscreen not supported for this player.");
                    }
                }}
            >
                <Icon name="fullscreen" size={25} color="white"/>
            </Pressable> */}
        
    </View>
  );
};

const styles = StyleSheet.create({
 buttonWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -35 }, { translateY: -35 }],
  },
  playButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  fullscreenButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 5,
    padding: 8,
    zIndex: 2,
  },

});

export default PostVideo;
