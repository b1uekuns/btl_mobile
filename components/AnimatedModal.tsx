/**
 * AnimatedModal — Bottom sheet mượt dùng React Native Animated API.
 * Chạy trên native thread (useNativeDriver: true) nên mượt hơn
 * RN <Modal animationType="slide"> chạy trên JS thread.
 *
 * Sử dụng:
 *   <AnimatedModal visible={show} onClose={() => setShow(false)}>
 *     ...nội dung...
 *   </AnimatedModal>
 */
import React, { useEffect, useRef, useState } from 'react'
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from 'react-native'

const SCREEN_HEIGHT = Dimensions.get('window').height

interface Props {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  /** Tắt đóng khi nhấn backdrop (mặc định false) */
  disableBackdropClose?: boolean
}

export default function AnimatedModal({
  visible,
  onClose,
  children,
  disableBackdropClose = false,
}: Props): React.ReactElement | null {
  // mounted kiểm soát khi nào Modal thực sự render/unmount
  const [mounted, setMounted] = useState(false)

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Mount trước, rồi animate in
      setMounted(true)
      translateY.setValue(SCREEN_HEIGHT)
      backdropOpacity.setValue(0)

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          damping: 22,       // ít nảy
          stiffness: 260,    // nhanh
          mass: 0.9,
          useNativeDriver: true,
        }),
      ]).start()
    } else if (mounted) {
      // Animate out xong mới unmount
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false)
      })
    }
  }, [visible])

  if (!mounted) return null

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"      // tắt animation mặc định — ta tự xử lý
      statusBarTranslucent      // backdrop phủ lên status bar
      onRequestClose={onClose}
    >
      {/* Backdrop mờ */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableWithoutFeedback
          onPress={disableBackdropClose ? undefined : onClose}
        >
          <View style={styles.backdropTouch} />
        </TouchableWithoutFeedback>
      </Animated.View>

      {/* Sheet trượt lên từ dưới */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        {children}
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.92,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
})
