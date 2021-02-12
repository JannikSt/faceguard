from facenet_pytorch import MTCNN

class FaceDetection:  
	
	mtcnn = MTCNN(image_size=160,margin=0) 
	
	def __init__(self): 
		pass 
	
	def cropface(self, img): 
		return self.mtcnn(img)   
    