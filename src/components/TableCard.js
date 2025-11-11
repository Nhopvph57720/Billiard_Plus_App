import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const TableCard = ({ table, onPress, layout = '2-column' }) => { // Thêm prop layout
  // Tính thời gian đã chơi từ session hiện tại
  const calculatePlayTime = (session) => {
    if (!session?.startTime) return '00:00';
    
    const now = new Date();
    const start = new Date(session.startTime);
    const diffInMinutes = Math.floor((now - start) / (1000 * 60));
    
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Xác định màu sắc theo status
  const getStatusColor = (status) => {
    switch (status) {
      case 'playing': // Đang chơi
        return '#007AFF';
      case 'occupied': // Có khách nhưng chưa chơi
        return '#FF9500'; 
      case 'reserved': // Đặt trước
        return '#8E4EC6';
      case 'maintenance': // Bảo trì
        return '#FF3B30';
      case 'available': // Trống
      default:
        return '#fff';
    }
  };

  const getTextColor = (status) => {
    return status === 'available' ? '#333' : '#fff';
  };

  // Text hiển thị theo trạng thái
  const getStatusText = (table) => {
    switch (table.status) {
      case 'playing':
        return calculatePlayTime(table.currentSession);
      case 'occupied':
        return 'Có khách';
      case 'reserved':
        return 'Đã đặt';
      case 'maintenance':
        return 'Bảo trì';
      case 'available':
      default:
        return 'Bàn trống';
    }
  };

  const backgroundColor = getStatusColor(table.status);
  const textColor = getTextColor(table.status);
  const statusText = getStatusText(table);
  const isPlaying = table.status === 'playing';

  const cardStyle = layout === '3-column' ? styles.tableCardGrid : styles.tableCard;

  return (
    <TouchableOpacity
      style={[
        cardStyle,
        { backgroundColor },
        table.status === 'available' && styles.availableCard,
      ]}
      onPress={() => onPress(table)}
      activeOpacity={0.7}
    >
      <View style={styles.tableContent}>
        {/* Simplified content for 3-column layout */}
        {layout === '3-column' ? (
          <>
            <Text style={[styles.tableNumber, { color: textColor }]}>
              {table.name ? table.name.replace('Bàn ', '') : table.id}
            </Text>
            {table.status === 'playing' || table.status === 'occupied' ? (
              <Text style={[styles.timeText, { color: textColor }]}>
                {statusText}
              </Text>
            ) : (
              <Text style={[styles.statusText, { color: textColor }]}>
                Bàn trống
              </Text>
            )}
          </>
        ) : (
          // Original complex layout
          <>
            {isPlaying && (
              <View style={styles.playingBadge}>
                <Text style={styles.playingBadgeText}>Đang chơi</Text>
              </View>
            )}
            
            {/* Số/Tên bàn */}
            <Text style={[styles.tableNumber, { color: textColor }]}>
              {table.name || `Bàn ${table.number || table.id}`}
            </Text>
            
            {/* Loại bàn */}
            {table.tableType?.name && (
              <Text style={[styles.tableType, { color: textColor }]}>
                {table.tableType.name}
              </Text>
            )}
            
            {/* Status text */}
            <Text style={[styles.statusText, { color: textColor }]}>
              {statusText}
            </Text>
            
            {/* Giá giờ */}
            {table.tableType?.hourlyRate && (
              <Text style={[styles.rateText, { color: textColor }]}>
                {table.tableType.hourlyRate.toLocaleString()}đ/giờ
              </Text>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tableCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
    marginBottom: 10,
  },
  tableCardGrid: { // Style cho layout 3 cột
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 5,
  },
  availableCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tableContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  playingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 1,
  },
  playingBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  tableType: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 2,
  },
  rateText: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '400',
  },
  timeText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default TableCard;