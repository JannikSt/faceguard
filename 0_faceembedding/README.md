# FaceGuard FaceEmbedding 

This chapter describes the model training approach to train a faceembedding model. 
You can choose between using a contrastive and a triplet loss. Both subchapters come with a jupyter notebook which allows you to train your own model. 

## Preconditions

Plese make sure, to first run the file "Dataset_Download_Augmentation.ipynb" in the augmentation folder.
This file creates a folder called "lfw_cropped", which contains the training images.
Also make sure to read the Readme in the augmentation folder.
 

## Performance Measurements
The following table illustrates our performance measurements. 
To generate a baseline performance measurement the so-called facenet python model is used. This model is based on an Inception Resnet V1 and achieves an LFW accuracy of 99,65%. In this case, the model was trained on the VGGFace2 dataset and the LFW dataset was used for validation.[https://github.com/timesler/facenet-pytorch]  In our experiments, the model achieved an accuracy of 93,60% at a prediction threshold of 1,1. After all, the ResNet-34 based on contrastive loss outperformed the other models we trained and is therefore used in the final implementation of FaceGuard. 

| Model                | Inc. ResNet V1 (Pretrained) | ResNet-18 | ResNet-18   | ResNet-34 | ResNet-34 | ResNet-34   | ResNet-50   |
|----------------------|--------------------------------|-----------|-------------|-----------|-----------|-------------|-------------|
| Loss Function        | -                              | Triplet   | Contrastive | Triplet   | Triplet   | Contrastive | Contrastive |
| Training Epochs      | -                              | 51        | 60          | 67        | 67        | 60          | 60          |
| Training Loss        | -                              | 0,018     | 0,000195    | 0,0095    | 0,014     | 0,00014     | 0,0017      |
| Validation Loss      | -                              | 0,07      | 0,0059      | 0,064     | 0,035     | 0,0056      | 0,0081      |
| Test Accuracy        | 93,60%                         | 88,5      | 92,70%      | 91,40%    | 89,00%    | 93,40%      | 89,1        |
| Test Threshold       | 1,1                            | 15,4      | 0,9         | 16,2      | 14,5      | 0,9         | 0,9         |
| Embedding Vectorsize | 8631                           | 1000      | 256         | 1000      | 512       | 256         | 1000        |  



