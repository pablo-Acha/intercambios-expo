import{useRef, useMemo, useState, useEffect } from 'react';
import { Animated, Easing } from "react-native";


import {
  Pressable,
  Text,
  Image,
  StyleSheet,
  View,
  Platform,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { ThemeColors } from '../../theme/colors';
import { getUserDoc } from '../../services/userService';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { storage } from '../../../app/config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export interface Product {
  id: string;
  title: string;
  price?: number;
  image?: string;
  description?: string;
  condition: 'Disponible' | 'No Disponible';
  category?: string;
  alias?: string | null;
  status?: 'pending' | 'approved' | 'rejected' | 'sold';
  ownerId?: string | null;
  // NUEVO: Campos de ubicación
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    meetingPoint?: string;
  };
}

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  isProfileCard?: boolean;
  onDelete?: () => void;
  onUpdate?: (data: Partial<Product>) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  isProfileCard = false,
  onDelete,
  onUpdate,
}) => {
  const animatedOpacity = useRef(new Animated.Value(0)).current
  const animatedTranslate = useRef(new Animated.Value(20)).current
  const { colors } = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isAvailable = product.condition === 'Disponible';
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price?.toString() ?? '');
  const [description, setDescription] = useState(product.description ?? '');
  const [ownerName, setOwnerName] = useState<string | null>(product.alias ?? null);
  const [ownerAvatar, setOwnerAvatar] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(product.image ?? null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingOwner, setLoadingOwner] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    const updateData: Partial<Product> = { 
      title: title.trim(),
      description: description.trim() || undefined
    };

    if (price.trim()) {
      updateData.price = Number(price);
    }

    onUpdate?.(updateData);
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(product.title);
    setPrice(product.price?.toString() ?? '');
    setDescription(product.description ?? '');
    setEditing(false);
  };

  const handleViewOnMap = () => {
    if (!product.location) {
      Alert.alert('Ubicación no disponible', 'Este producto no tiene ubicación registrada');
      return;
    }

    router.push({
      pathname: '/routes',
      params: {
        productId: product.id,
        productTitle: product.title,
        destinationLat: product.location.latitude,
        destinationLng: product.location.longitude,
        meetingPoint: product.location.meetingPoint || 'Punto de encuentro'
      }
    });
  };

  const handleEditLocation = () => {
    // Navegar a pantalla de edición completa
    router.push(`/my-post/edit/${product.id}`);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!product) return;
      if (product.ownerId) {
        try {
          setLoadingOwner(true);
          const user = await getUserDoc(product.ownerId);
          if (!mounted) return;
          const name = (user && (user.username || user.displayName)) ?? product.alias ?? 'Usuario';
          setOwnerName(name);
          const avatar =
            (user &&
              (user.photoUrl || user.photoURL || user.avatarUrl || user.profileImage || user.image || user.picture)) ??
            null;
          setOwnerAvatar(avatar);
        } catch {
          if (mounted) {
            setOwnerName(product.alias ?? 'Usuario');
            setOwnerAvatar(null);
          }
        } finally {
          if (mounted) setLoadingOwner(false);
        }
      } else {
        setOwnerName(product.alias ?? 'Usuario');
        setOwnerAvatar(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [product?.ownerId, product?.alias]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingImage(true);
      try {
        const img = product.image;
        if (!img) {
          if (mounted) setImageUri(null);
          return;
        }
        if (img.startsWith('http://') || img.startsWith('https://')) {
          if (mounted) setImageUri(img);
        } else {
          try {
            const url = await getDownloadURL(storageRef(storage, img));
            if (mounted) setImageUri(url);
          } catch {
            if (mounted) setImageUri(img);
          }
        }
      } catch {
        if (mounted) setImageUri(product.image ?? null);
      } finally {
        if (mounted) setLoadingImage(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [product.image]);

  useEffect(() => {
  const randomDelay = Math.random() * 300; // evita efecto robotico

  Animated.parallel([
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 350,
      delay: randomDelay,
      useNativeDriver: true
    }),
    Animated.timing(animatedTranslate, {
      toValue: 0,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      delay: randomDelay,
      useNativeDriver: true
    })
  ]).start()
}, [])

  return (
    <Animated.View style={{ opacity: animatedOpacity, transform: [{ translateY: animatedTranslate }] }}>

    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      android_ripple={{ color: `${(colors as any).primary}20` }}
    >
      <View style={styles.imageContainer}>
        {loadingImage ? (
          <View style={styles.image}>
            <ActivityIndicator />
          </View>
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholder]} />
        )}
        <View style={[styles.statusBadge, isAvailable ? styles.availableBadge : styles.unavailableBadge]}>
          <View style={[styles.statusDot, isAvailable ? styles.availableDot : styles.unavailableDot]} />
          <Text style={styles.statusText}>{isAvailable ? 'Disponible' : 'No disponible'}</Text>
        </View>
        {product.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        )}
        
        {/* NUEVO: Badge de ubicación */}
        {product.location && (
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={12} color="white" />
            <Text style={styles.locationText}>Ubicación</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        {editing ? (
          <>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={[styles.input, { borderColor: colors.border }]}
              placeholder="Título del producto"
            />
            
            <Text style={styles.label}>Precio:</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={[styles.input, { borderColor: colors.border }]}
              placeholder="0.00"
            />
            
            <Text style={styles.label}>Descripción:</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { borderColor: colors.border, height: 80, textAlignVertical: 'top' }]}
              placeholder="Descripción del producto"
              multiline
            />

            <View style={styles.editActions}>
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: '#6b7280' }]}
                onPress={handleCancel}
              >
                <Text style={styles.editButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: '#10b981' }]}
                onPress={handleSave}
              >
                <Text style={styles.editButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text numberOfLines={2} style={styles.title}>
              {product.title}
            </Text>
            
            {product.description && (
              <Text numberOfLines={2} style={styles.description}>
                {product.description}
              </Text>
            )}

            <View style={styles.footer}>
              <View style={styles.priceContainer}>
                {product.price != null ? (
                  <>
                    <Text style={styles.priceLabel}>Precio</Text>
                    <Text style={styles.price}>Bs {product.price.toFixed(2)}</Text>
                  </>
                ) : (
                  <Text style={styles.exchangeText}>Intercambio</Text>
                )}
              </View>
              <View style={styles.sellerContainer}>
                {loadingOwner ? (
                  <View style={styles.sellerAvatar}>
                    <ActivityIndicator size="small" />
                  </View>
                ) : ownerAvatar ? (
                  <Image source={{ uri: ownerAvatar }} style={styles.sellerAvatarImage} />
                ) : (
                  <View style={styles.sellerAvatar}>
                    <Text style={styles.sellerInitial}>
                      {ownerName && ownerName[0] ? ownerName[0].toUpperCase() : 'U'}
                    </Text>
                  </View>
                )}
                <Text numberOfLines={1} style={styles.sellerName}>
                  @{ownerName ?? 'Usuario'}
                </Text>
              </View>
            </View>

            {/* NUEVO: Información de ubicación */}
            {product.location && (
              <View style={styles.locationInfo}>
                <Ionicons name="location-outline" size={16} color={colors.muted} />
                <Text style={[styles.locationAddress, { color: colors.muted }]} numberOfLines={1}>
                  {product.location.meetingPoint || product.location.address || 'Ubicación disponible'}
                </Text>
                <TouchableOpacity onPress={handleViewOnMap} style={styles.mapButton}>
                  <Text style={styles.mapButtonText}>Ver en mapa</Text>
                </TouchableOpacity>
              </View>
            )}

            {product.status && (
              <View style={styles.statusContainer}>
                <Text style={[styles.statusText, { color: colors.muted }]}>
                  Estado: {product.status}
                </Text>
              </View>
            )}

            {isProfileCard && (
              <View style={styles.profileActions}>
                <TouchableOpacity 
                  style={[styles.profileButton, { backgroundColor: '#3b82f6' }]}
                  onPress={() => setEditing(true)}
                >
                  <Ionicons name="pencil" size={16} color="white" />
                  <Text style={styles.profileButtonText}>Editar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.profileButton, { backgroundColor: '#ef4444' }]}
                  onPress={onDelete}
                >
                  <Ionicons name="trash" size={16} color="white" />
                  <Text style={styles.profileButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </Pressable>
    </Animated.View>
  );
};

const createStyles = (colors: ThemeColors | any) =>
  StyleSheet.create({
    container: {
      backgroundColor: (colors as any).surface || (colors as any).background,
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor:
        (colors as any).border ||
        ((String((colors as any).background) === '#f8fafc' ? '#e5e7eb' : 'rgba(255,255,255,0.1)')),
      ...Platform.select({
        ios: {
          shadowColor: ((colors as any).shadow as string) ?? '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    pressed: {
      opacity: 0.95,
      transform: [{ scale: 0.98 }],
    },
    imageContainer: {
      width: '100%',
      height: 200,
      position: 'relative',
      backgroundColor: '#f3f4f6',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    placeholder: { backgroundColor: '#eee' },
    statusBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 6,
    },
    availableBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.95)',
    },
    unavailableBadge: {
      backgroundColor: 'rgba(239, 68, 68, 0.95)',
    },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    availableDot: { backgroundColor: '#fff' },
    unavailableDot: { backgroundColor: '#fff' },
    statusText: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
    categoryBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },
    categoryText: { 
      color: '#fff', 
      fontSize: 11, 
      fontWeight: '600', 
      textTransform: 'uppercase', 
      letterSpacing: 0.5 
    },
    locationBadge: {
      position: 'absolute',
      bottom: 12,
      left: 12,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(59, 130, 246, 0.95)',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 4,
    },
    locationText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '600',
    },
    body: { 
      padding: 16, 
      gap: 12 
    },
    label: {
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 4,
      color: (colors as any).text,
    },
    input: {
      borderWidth: 1,
      padding: 8,
      borderRadius: 6,
      color: (colors as any).text,
      backgroundColor: (colors as any).surface,
    },
    title: { 
      fontSize: 18, 
      fontWeight: '700', 
      lineHeight: 24, 
      color: (colors as any).text, 
      marginBottom: 4 
    },
    description: {
      fontSize: 14,
      color: (colors as any).muted,
      lineHeight: 20,
    },
    footer: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'flex-end', 
      gap: 12 
    },
    priceContainer: { 
      flex: 1 
    },
    priceLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: (colors as any).subtitle || `${(colors as any).text}80`,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    price: { 
      fontSize: 22, 
      fontWeight: '800', 
      color: (colors as any).primary || '#10b981', 
      letterSpacing: -0.5 
    },
    exchangeText: { 
      fontSize: 16, 
      fontWeight: '700', 
      color: (colors as any).primary || '#10b981', 
      paddingVertical: 4 
    },
    sellerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor:
        String((colors as any).background) === '#f8fafc' || String((colors as any).surface) === '#ffffff'
          ? '#f9fafb'
          : 'rgba(255,255,255,0.05)',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 20,
      maxWidth: '50%',
    },
    sellerAvatar: { 
      width: 28, 
      height: 28, 
      borderRadius: 14, 
      backgroundColor: (colors as any).primary || '#10b981', 
      alignItems: 'center', 
      justifyContent: 'center' 
    },
    sellerAvatarImage: { 
      width: 28, 
      height: 28, 
      borderRadius: 14 
    },
    sellerInitial: { 
      color: '#fff', 
      fontSize: 13, 
      fontWeight: '700' 
    },
    sellerName: { 
      fontSize: 13, 
      fontWeight: '600', 
      color: (colors as any).text, 
      flex: 1 
    },
    locationInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      backgroundColor: String((colors as any).background) === '#f8fafc' 
        ? '#f3f4f6' 
        : 'rgba(255,255,255,0.05)',
      borderRadius: 8,
    },
    locationAddress: {
      flex: 1,
      fontSize: 13,
    },
    mapButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: '#3b82f6',
      borderRadius: 6,
    },
    mapButtonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
    },
    statusContainer: {
      marginTop: 8,
    },
    editActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    editButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    editButtonText: {
      color: 'white',
      fontWeight: '600',
    },
    profileActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    profileButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderRadius: 8,
      gap: 6,
    },
    profileButtonText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
    },
  });

export default ProductCard;