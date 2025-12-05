import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const menuItems = [
  { id: 1, title: "Quản lý câu lạc bộ", icon: "people", route: "Management" },
  { id: 2, title: "Quản lý hóa đơn", icon: "receipt", route: "Bills" },
  { id: 7, title: "Thiết lập ", icon: "settings", route: "Settings" },
  { id: 8, title: "Đăng xuất", icon: "log-out", route: "Logout" },
];

export default function Menu({ visible, onClose, navigation }) {
  const screenWidth = Dimensions.get('window').width;
  const menuWidth = screenWidth * 0.8;
  const translateX = useRef(new Animated.Value(-menuWidth)).current;
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    if (visible) {
      // open: show modal then slide in
      setShowModal(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else if (showModal) {
      // close: slide out then hide modal
      Animated.timing(translateX, {
        toValue: -menuWidth,
        duration: 180,
        useNativeDriver: true,
      }).start(() => setShowModal(false));
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(translateX, {
      toValue: -menuWidth,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      onClose && onClose();
    });
  };

  return (
    <Modal transparent={true} visible={showModal} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[styles.menuContainer, { width: menuWidth, transform: [{ translateX }] }]}
        >
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={async () => {
                if (item.route === "Logout") {
                  // 👉 Xử lý đăng xuất ở đây
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "LoginScreen" }],
                  });

                  handleClose();
                  return;
                }

                // 👉 Mặc định: điều hướng đến màn hình khác
                navigation.navigate(item.route);
                // animate out then inform parent
                handleClose();
              }}
            >
              <Ionicons name={item.icon} size={24} color="#666" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* clickable overlay on the right (tap to close) */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlayRight} />
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: 'row',
  },
  menuContainer: {
    width: "80%",
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
  },
  overlayRight: {
    flex: 1,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
});
