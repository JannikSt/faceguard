# FaceGuard classification using annoy

This chapter consists of  a notebook to compare the classifier training and prediction performance on a simple memory database, spotify's annoy prediction as well as a SVM. 

## Preconditions: 
The dataset has to be available first. Please execute the file "Dataset_Download_Augmentation.ipynb" in the faceembedding/augmentation folder first.

## Measurement results  
150 images were used for testing. The training time was obviously the fastest when using an in-memory database. The fastest prediction time was achieved using annoy hence this was also chosen for FaceGuard.

| Method          | Trainingtime (s) | Predictiontime (s)|
|-----------------|--------------|----------------|
| Memory database | 0,00026      | 0,011          |
| Annoy           | 0,016        | 0,00067        |
| SVM             | 0,98         | 0,0034         |
