/**
 * SortRow – thanh sắp xếp nằm ngang dạng chip
 * Dùng chung cho màn hình câu hỏi và đề thi
 */
import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../constants/colors'

export interface SortOption {
  value: string
  label: string
  icon?: keyof typeof Ionicons.glyphMap
}

interface Props {
  options: SortOption[]
  value: string
  onChange: (v: string) => void
}

export default function SortRow({ options, value, onChange }: Props): React.ReactElement {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Sắp xếp:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {options.map((opt) => {
          const active = value === opt.value
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange(opt.value)}
            >
              {opt.icon && (
                <Ionicons
                  name={opt.icon}
                  size={13}
                  color={active ? '#fff' : Colors.muted}
                  style={styles.icon}
                />
              )}
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  label: { fontSize: 12, color: Colors.muted, fontWeight: '600', flexShrink: 0 },
  scroll: { flex: 1 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  icon: { marginRight: 4 },
  chipText: { fontSize: 12, color: Colors.muted, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
})
