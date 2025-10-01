import { StyleSheet, Text, Touchable, TouchableOpacity, View, Image, Pressable, Alert, Share } from 'react-native'
import React, { useEffect, useState } from 'react'
import { theme } from '../constants/Theme'
import { hp, stripHtmlTags, wp } from '../helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '../assets/icons'
import RenderHtml from 'react-native-render-html'
import { downloadFile, getSupabaseFileUrl } from '../services/imageService'
import { useVideoPlayer, VideoView } from 'expo-video'
import { Video } from 'expo-av'
import PostVideo from '../constants/PostVideo'
import { createPostLike, removePostLike } from '../services/postService'
import Loading from './Loading'
import * as Sharing from 'expo-sharing'


const textStyle = {
    color: theme.colors.dark,
    fontSize: hp(1.75)
}
const tagsStyles  = {
    div: textStyle,
    p: textStyle,
    ol: textStyle,
    h1: {
        color: theme.colors.dark
    },
    h4: {
        color: theme.colors.dark
    }
}
const PostCard = ({
    item, 
    currentUser,
    router,
    hasShadow = true,
}) => {
    const shadowStyles = {
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1
    }

    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setLikes(item?.postLikes)
    },[])
const openPostDetails = ()=>{

}

const onLike = async() => {
    if(liked){
        let updatedLikes = likes.filter(like=> like.userId!=currentUser?.id);
    setLikes([...updatedLikes])
    let res = await removePostLike(item?.id, currentUser?.id);
    console.log('Remove like: ', res);
    if(!res.success){
        Alert.alert('Post', 'Something Went Wrong');
    } 
    }else{
       let data = {
        userId: currentUser?.id,
        postId: item?.id
    }
    setLikes([...likes, data])
    let res = await createPostLike(data);
    console.log('added like: ', res);
    if(!res.success){
        Alert.alert('Post', 'Something Went Wrong');
    } 
    } 
}
  const onShare = async () => {
  try {
    // If no file attached → share text only
    if (!item?.file) {
      await Share.share({
        message: stripHtmlTags(item?.body || ""),
      });
      return;
    }

    // If file attached → download & share
    setLoading(true);
    const remoteUrl = getSupabaseFileUrl(item?.file).uri;
    const localUri = await downloadFile(remoteUrl); // this is already "file://..."
    setLoading(false);

    if (!localUri) {
      console.warn("Download failed, falling back to sharing text + link.");
      await Share.share({
        message: stripHtmlTags(item?.body || ""),
        url: remoteUrl,
      });
      return;
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localUri, {
        dialogTitle: "Share File",
      });
    } else {
      await Share.share({
        message: stripHtmlTags(item?.body || ""),
        url: remoteUrl,
      });
    }
  } catch (err) {
    console.error("Error sharing:", err);
    setLoading(false);
  }
};

const createdAt = moment(item?.created_at).format('MMM D');
const liked = likes.filter(like=> like.userId==currentUser?.id)[0]? true: false;

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        {/* user ingot and post time */}
        <View style={styles.userInfo}>
            <Avatar 
                size={hp(4.5)}
                uri={item?.user?.image}
                rounded={theme.radius.md}
            />
            <View style={{gap: 2}}>
                <Text style={styles.username}>{item?.user?.name}</Text>
                <Text style={styles.username}>{createdAt}</Text>
            </View>
        </View>

        <TouchableOpacity onPress={openPostDetails}>
            <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* post body */}

      <View style={styles.content}>
        <View style={styles.postBody}>
            {
                item?.body && (
                    <RenderHtml 
                    contentWidth={wp(100)}
                    source={{html: item?.body }}
                    tagsStyles={tagsStyles}
                    />
                )
            }
        </View>

        {/* post image */}

        {
            item?.file && item?.file?.includes('postImages') && (
                <Image source={getSupabaseFileUrl(item?.file)}
                transition = {100}
                style={styles.postMedia}
                contentFit = 'cover'
                />
            )
        }

        {/* post video */}

        {
            item?.file && item?.file.includes('postVideos') && (
                <PostVideo
                    file={item?.file} 
                    style={[styles.postMedia, { height: hp(30) }]} 
                />

            )
        }
      </View>

      {/* like, comment, and share */}
        <View style={styles.footer}>
            <View style={styles.footerBottom}>
                <TouchableOpacity onPress={onLike}>
                    <Icon name="heart" size={24} fill={liked? theme.colors.rose: 'transparent'} color={liked? theme.colors.rose: theme.colors.textDark} />
                </TouchableOpacity>
                <Text style={styles.count}>
                    {
                        likes?.length
                    }
                </Text>
            </View>
            <View style={styles.footerBottom}>
                <TouchableOpacity>
                    <Icon name="comment" size={24} color={ theme.colors.textDark} />
                </TouchableOpacity>
                <Text style={styles.count}>
                    {
                        0
                    }
                </Text>
            </View>
            <View style={styles.footerBottom}>
                {
                    loading? (
                        <Loading size="small"/>
                    ):(
                        <TouchableOpacity onPress={onShare}>
                        <Icon name="share" size={24} color={ theme.colors.textDark} />
                        </TouchableOpacity> 
                    )
                }
                
                
            </View>
        </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl*1.1,
        borderCurve: 'continuous',
        padding: 10,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: '#000'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    username: {
        fontSize: hp(1.7),
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium
    },
    postTime: {
        fontSize: hp(1.4),
        color: theme.colors.textLight,
        fontWeight: theme.fonts.medium,
    },
    content: {
        gap: 10,
    },
    postMedia: {
        height: hp(40),
        width: '100%',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        overflow: "hidden",

    },
    postBody: {
        marginLeft: 5,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },
    footerBottom: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
    },
    count: {
        color: theme.colors.text,
        fontSize: hp(1.8)
    }

})