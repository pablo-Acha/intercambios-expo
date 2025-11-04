import React, { useMemo, useState } from "react";
import { Stack } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from "../../../../src/hooks/useThemeColors";
import type { ThemeColors } from "../../../../src/theme/colors";
import { useAuth } from "../../../context/AuthContext";
import { uploadToCloudinary } from "../../../../src/services/cloudinary";
import { createProduct } from "../../../../src/services/productService";
import LocationPicker from "../../../../src/components/location/LocationPicker";

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: colors.background || "#f8f9fa",
    },
    container: {
      paddingBottom: 24,
    },
    headerContainer: {
      backgroundColor: colors.primary || "#1a1a2e",
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: "#ffffff",
      marginBottom: 4,
      letterSpacing: 0.3,
    },
    subtitleText: {
      fontSize: 15,
      color: colors.subtitle || "#e0e0e0",
      fontWeight: "400",
      opacity: 0.9,
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    accentLine: {
      width: 4,
      height: 24,
      backgroundColor: colors.primary || "#1a1a2e",
      borderRadius: 2,
      marginRight: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text || "#000",
      letterSpacing: 0.3,
    },
    label: {
      color: colors.text,
      fontWeight: "600",
      marginBottom: 10,
      fontSize: 14,
    },
    input: {
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: 14,
      borderRadius: 12,
      color: colors.text,
      fontSize: 15,
    },
    pickerContainer: {
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 12,
      backgroundColor: colors.surface,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },
    buttonToggle: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonToggleInactive: {
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    buttonToggleActive: {
      borderColor: colors.primary || "#10b981",
      backgroundColor: colors.primary || "#10b981",
    },
    buttonToggleText: {
      fontWeight: "600",
      fontSize: 14,
    },
    imageContainer: {
      marginBottom: 16,
    },
    imagePreview: {
      width: "100%",
      height: 220,
      borderRadius: 12,
      marginBottom: 12,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
    },
    imageButtonsRow: {
      flexDirection: "row",
      gap: 10,
    },
    imageButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.primary || "#10b981",
      backgroundColor: "transparent",
      paddingVertical: 12,
      borderRadius: 12,
      gap: 8,
    },
    imageButtonText: {
      color: colors.primary || "#10b981",
      fontWeight: "700",
      fontSize: 14,
    },
    submitButton: {
      backgroundColor: colors.primary || "#10b981",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 12,
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    submitButtonText: {
      color: "white",
      fontWeight: "800",
      fontSize: 16,
    },
    errorText: {
      color: "#ef4444",
      marginTop: 10,
      fontSize: 14,
      fontWeight: "500",
    },
    hintText: {
      color: colors.subtitle,
      marginTop: 12,
      fontSize: 13,
      fontStyle: "italic",
    },
  });

const categories = ["Electrónica", "Ropa", "Libros", "Hogar", "Deportes", "Otros"];

const PublishScreen: React.FC = () => {
  const { colors } = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [type, setType] = useState<"Venta" | "Intercambio">("Venta");
  const [condition, setCondition] = useState<"Nuevo" | "Como nuevo" | "Usado">("Usado");
  const [career, setCareer] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null);

  const pickImage = async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) return Alert.alert("Permiso denegado", "No se pudo acceder a la galería");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) setImageUri(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const res = await ImagePicker.requestCameraPermissionsAsync();
    if (!res.granted) return Alert.alert("Permiso denegado", "No se pudo acceder a la cámara");
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true });
    if (!result.canceled && result.assets && result.assets.length > 0) setImageUri(result.assets[0].uri);
  };

  const validate = () => {
    if (!imageUri) return setError("Imagen obligatoria"), false;
    if (!title.trim()) return setError("Título obligatorio"), false;
    if (!category.trim()) return setError("Selecciona una categoría"), false;
    if (!career.trim()) return setError("Indica la carrera"), false;
    if (type === "Venta" && !price.trim()) return setError("Precio obligatorio para venta"), false;
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    if (!validate()) return;
    if (!user) return Alert.alert("No autenticado", "Inicia sesión para publicar");
    
    setLoading(true);
    
    try {
      console.log('Subiendo imagen a Cloudinary...');
      const uploadResult = await uploadToCloudinary(imageUri!, { width: 400 });
      console.log('Imagen subida exitosamente:', uploadResult.secure_url);

      const payload = {
        title: title.trim(),
        category: category.trim(),
        type,
        condition,
        career: career.trim(),
        price: type === "Venta" ? (isNaN(Number(price)) ? 0 : Number(price)) : null,
        description: description.trim() || null,
        images: { 
          original: uploadResult.secure_url, 
          thumb: uploadResult.thumb_url || uploadResult.secure_url 
        },
        location: location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
          meetingPoint: location.meetingPoint
        } : null
      };

      console.log('Creando producto con payload:', payload);

      const productId = await createProduct(payload, user.uid);
      console.log('Producto creado con ID:', productId);
      
      setTitle("");
      setCategory(categories[0]);
      setType("Venta");
      setCondition("Usado");
      setCareer("");
      setPrice("");
      setDescription("");
      setImageUri(null);
      setLocation(null);
      
      Alert.alert("Éxito", "Espera hasta que un administrador decida si aprobar tu publicación");
    } catch (e: any) {
      console.error('Error completo al publicar:', e);
      Alert.alert("Error", e.message || "Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary || "#1a1a2e"} />
      <Stack.Screen
        options={{
          title: "Publicar",
          headerStyle: {
            backgroundColor: colors.primary || "#1a1a2e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 20,
          },
        }}
      />
      <View style={styles.wrapper}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Nueva publicación</Text>
          <Text style={styles.subtitleText}>Completa los datos de tu producto</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
          <View style={styles.contentContainer}>
            {/* Sección de Imagen */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                  <View style={styles.accentLine} />
                  <Text style={styles.sectionTitle}>Imagen / Cover</Text>
                </View>
              </View>
              <View style={styles.imageContainer}>
                {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
                <View style={styles.imageButtonsRow}>
                  <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                    <Ionicons name="image-outline" size={18} color={colors.primary || "#10b981"} />
                    <Text style={styles.imageButtonText}>Elegir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                    <Ionicons name="camera-outline" size={18} color={colors.primary || "#10b981"} />
                    <Text style={styles.imageButtonText}>Tomar foto</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Sección de Información Básica */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                  <View style={styles.accentLine} />
                  <Text style={styles.sectionTitle}>Información</Text>
                </View>
              </View>

              <Text style={styles.label}>Título</Text>
              <TextInput 
                value={title} 
                onChangeText={setTitle} 
                placeholder="Ej: Libro de programación" 
                placeholderTextColor={colors.subtitle} 
                style={styles.input} 
              />

              <Text style={styles.label}>Categoría</Text>
              <View style={styles.pickerContainer}>
                <Picker 
                  selectedValue={category} 
                  onValueChange={(itemValue: string) => setCategory(itemValue)} 
                  style={{ color: colors.text }}
                >
                  {categories.map((cat) => (
                    <Picker.Item key={cat} label={cat} value={cat} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Carrera</Text>
              <TextInput 
                value={career} 
                onChangeText={setCareer} 
                placeholder="Sistemas, Industrial..." 
                placeholderTextColor={colors.subtitle} 
                style={styles.input} 
              />
            </View>

            {/* Sección de Tipo y Estado */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                  <View style={styles.accentLine} />
                  <Text style={styles.sectionTitle}>Detalles</Text>
                </View>
              </View>

              <Text style={styles.label}>Tipo de operación</Text>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => setType("Venta")}
                  style={[
                    styles.buttonToggle,
                    type === "Venta" ? styles.buttonToggleActive : styles.buttonToggleInactive,
                  ]}
                >
                  <Text style={[styles.buttonToggleText, { color: type === "Venta" ? "white" : colors.text }]}>
                    Venta
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setType("Intercambio")}
                  style={[
                    styles.buttonToggle,
                    type === "Intercambio" ? styles.buttonToggleActive : styles.buttonToggleInactive,
                  ]}
                >
                  <Text style={[styles.buttonToggleText, { color: type === "Intercambio" ? "white" : colors.text }]}>
                    Intercambio
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Estado del producto</Text>
              <View style={styles.row}>
                <TouchableOpacity 
                  onPress={() => setCondition("Nuevo")} 
                  style={[
                    styles.buttonToggle,
                    condition === "Nuevo" ? styles.buttonToggleActive : styles.buttonToggleInactive,
                  ]}
                >
                  <Text style={[styles.buttonToggleText, { color: condition === "Nuevo" ? "white" : colors.text }]}>
                    Nuevo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setCondition("Como nuevo")} 
                  style={[
                    styles.buttonToggle,
                    condition === "Como nuevo" ? styles.buttonToggleActive : styles.buttonToggleInactive,
                  ]}
                >
                  <Text style={[styles.buttonToggleText, { color: condition === "Como nuevo" ? "white" : colors.text }]}>
                    Como nuevo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setCondition("Usado")} 
                  style={[
                    styles.buttonToggle,
                    condition === "Usado" ? styles.buttonToggleActive : styles.buttonToggleInactive,
                  ]}
                >
                  <Text style={[styles.buttonToggleText, { color: condition === "Usado" ? "white" : colors.text }]}>
                    Usado
                  </Text>
                </TouchableOpacity>
              </View>

              {type === "Venta" && (
                <>
                  <Text style={styles.label}>Precio</Text>
                  <TextInput 
                    value={price} 
                    onChangeText={setPrice} 
                    placeholder="0.00" 
                    keyboardType="numeric" 
                    placeholderTextColor={colors.subtitle} 
                    style={styles.input} 
                  />
                </>
              )}
            </View>

            {/* Sección de Descripción y Ubicación */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.titleContainer}>
                  <View style={styles.accentLine} />
                  <Text style={styles.sectionTitle}>Detalles adicionales</Text>
                </View>
              </View>

              <Text style={styles.label}>Descripción</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Detalles adicionales del producto..."
                placeholderTextColor={colors.subtitle}
                style={[styles.input, { height: 120, textAlignVertical: "top" }]}
                multiline
              />

              <Text style={[styles.label, { marginTop: 16 }]}>Ubicación</Text>
              <LocationPicker
                value={location}
                onChange={setLocation}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity 
              style={[styles.submitButton, loading && { opacity: 0.7 }]} 
              onPress={handleSubmit} 
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Publicar (pendiente)</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.hintText}>
              Tu publicación quedará en estado "pending" hasta que un administrador la apruebe.
            </Text>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PublishScreen;