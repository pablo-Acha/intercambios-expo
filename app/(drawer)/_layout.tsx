import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useThemeColors } from "../../src/hooks/useThemeColors";
import { useProfileStore } from "../../src/store/useProfileStore";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from '@expo/vector-icons'; 

const DrawerLayout = () => {
  const { colors } = useThemeColors();
  const { setProfile, clearProfile, isAdmin } = useProfileStore();
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          const data = userSnap.exists() ? userSnap.data() : {};
          const role = (data?.role ?? "user").toString().toLowerCase();
          setProfile({
            uid: currentUser.uid,
            displayName:
              data?.displayName ??
              currentUser.displayName ??
              currentUser.email ??
              null,
            isAdmin: role === "admin",
          });
        } catch {
          clearProfile();
        }
      } else {
        clearProfile();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <Drawer
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        drawerContentStyle: { backgroundColor: colors.drawerBackground },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.muted,
        drawerLabelStyle: { marginLeft: -20 },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView
          {...props}
          style={{ backgroundColor: colors.drawerBackground }}
        >
          <DrawerItem
            label="Inicio"
            icon={({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            )}
            onPress={() => props.navigation.navigate("(tabs)")}
            labelStyle={{ color: colors.text }}
          />
          
          {/* NUEVO: Item del Mapa */}
          <DrawerItem
            label="Mapa General"
            icon={({ color, size }) => (
              <Ionicons name="map-outline" size={size} color={color} />
            )}
            onPress={() => props.navigation.navigate("map/general")}
            labelStyle={{ color: colors.text }}
          />
          
          <DrawerItem
            label="Chat"
            icon={({ color, size }) => (
              <Ionicons name="chatbubble-outline" size={size} color={color} />
            )}
            onPress={() => props.navigation.navigate("chats")}
            labelStyle={{ color: colors.text }}
          />
          
          <DrawerItem
            label="Sobre la app"
            icon={({ color, size }) => (
              <Ionicons name="information-circle-outline" size={size} color={color} />
            )}
            onPress={() => props.navigation.navigate("about")}
            labelStyle={{ color: colors.text }}
          />

          {isAdmin && (
            <DrawerItem
              label="Moderación"
              icon={({ color, size }) => (
                <Ionicons name="shield-checkmark-outline" size={size} color={color} />
              )}
              onPress={() => props.navigation.navigate("moderation/index")}
              labelStyle={{ color: colors.text }}
            />
          )}

          <DrawerItem
            label="Cerrar sesión"
            icon={({ color, size }) => (
              <Ionicons name="log-out-outline" size={size} color="red" />
            )}
            onPress={async () => {
              const res = await logout();
              if (res.success) {
                props.navigation.navigate("login");
              } else {
                console.log("Error al cerrar sesión:", res.error);
              }
            }}
            labelStyle={{ color: "red", fontWeight: "bold" }}
          />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          drawerLabel: "Inicio",
        }}
      />
      
      {/* NUEVO: Pantalla del Mapa */}
      <Drawer.Screen
        name="map/general"
        options={{
          title: "Mapa General",
          drawerLabel: "Mapa General",
          headerShown: true,
        }}
      />
      
      <Drawer.Screen
        name="about"
        options={{
          title: "Sobre la app",
          drawerLabel: "Sobre la app",
        }}
      />
      
      <Drawer.Screen
        name="chats"
        options={{
          title: "Chat",
          drawerLabel: "Chat",
        }}
      />
      <Drawer.Screen
        name="routes"
        options={{
          title: "Ruta",
          drawerLabel: "Ruta",
          headerShown: true,
        }}
      />
      {isAdmin && (
        <Drawer.Screen
          name="moderation/index"
          options={{
            title: "Panel de Moderación",
            drawerLabel: "Moderación",
          }}
        />
      )}
    </Drawer>
  );
};

export default DrawerLayout;