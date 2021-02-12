from facenet_pytorch import MTCNN, InceptionResnetV1
import numpy as np
import torchvision.models as models
import torch
import torch.nn as nn

class EmbeddingModel:
    #resnet = InceptionResnetV1(pretrained='vggface2').eval()


    def __init__(self):
        self.model = models.resnet34(pretrained=False)
        self.model.fc = nn.Linear(512, 512)
        self.model.load_state_dict(torch.load(
            './resnet-34-512out.pth', map_location=torch.device('cpu')))
        self.model.eval()

    def generateEmbedding(self, img):
        #img_embedding = self.resnet(img.unsqueeze(0))
        img_embedding = self.model.forward(img.unsqueeze(0))

        return img_embedding

    def l2(self, embeddinga, embeddingb):
        return np.linalg.norm(np.subtract(embeddinga.detach().numpy(), embeddingb.detach().numpy()))

