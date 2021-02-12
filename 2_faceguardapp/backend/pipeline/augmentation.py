from keras.preprocessing.image import ImageDataGenerator, array_to_img, img_to_array, load_img

class ImageAugmentation:

    datagen = ImageDataGenerator(
            rotation_range = 45,
            shear_range = 0.4,
            horizontal_flip = True,
            brightness_range = (0.1, 4)
    )
    def __init__(self):
        pass

    def run_augmentation(self, img):
        img_array = img_to_array(img)
        img_array_reshaped = img_array.reshape((1,) + img_array.shape)

        dir_It = self.datagen.flow(
                img_array_reshaped,
                batch_size=1
                )

        return dir_It