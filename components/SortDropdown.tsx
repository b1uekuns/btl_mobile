/**
 * SortDropdown – nút sắp xếp dạng dropdown
 * Hiện danh sách option trong modal khi bấm, đóng khi chọn hoặc tap ngoài
 */
import React, { useState, useRef } from 'react'
import {
  View, Text, TouchableOpacity, Modal, StyleSheet,
  TouchableWithoutFeedback, ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../constants/colors'

export interface SortOption {
  value: string
  label: string
}

interface Props {
  options: SortOption[]
  value: string
  onChange: (v: string) => void
  /** Label phía trước nút, mặc định "Sắp xếp" */
  label?: string
}

export default function SortDropdown({ options, value, onChange, label = 'Sắp xếp' }: Props): React.ReactElement {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  function pick(v: string): void {
    onChange(v)
    setOpen(false)
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.prefixLabel}>{label}:</Text>

      {/* Nút trigger */}
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)} activeOpacity={0.75}>
        <Text style={styles.triggerText} numberOfLines={1}>{selected?.label ?? '—'}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={14} color={Colors.primary} />
      </TouchableOpacity>

      {/* Dropdown modal */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Menu nổi */}
        <View style={styles.menu} pointerEvents="box-none">
          <View style={styles.menuInner}>
            <Text style={styles.menuTitle}>{label}</Text>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {options.map((opt, i) => {
                const active = opt.value === value
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[
                      styles.item,
                      active && styles.itemActive,
                      i === options.length - 1 && styles.itemLast,
                    ]}
                    onPress={() => pick(opt.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.itemText, active && styles.itemTextActive]}>
                      {opt.label}
                    </Text>
                    {active && (
                      <Ionicons name="checkmark" size={16} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  prefixLabel: {
    fontSize: 12,
    color: Colors.muted,
    fontWeight: '600',
    flexShrink: 0,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '60',
    backgroundColor: Colors.primaryLight,
  },
  triggerText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },

  // Backdrop
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // Menu
  menu: {
    position: 'absolute',
    top: 110,   // xuất hiện ngay dưới filter bar + sort bar
    left: 16,
    right: 16,
  },
  menuInner: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  menuTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  itemLast: {},
  itemActive: { backgroundColor: Colors.primaryLight },
  itemText: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  itemTextActive: { color: Colors.primary, fontWeight: '700' },
})
