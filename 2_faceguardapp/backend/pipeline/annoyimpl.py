from annoy import AnnoyIndex
import operator


# Train annoy
class Annoy:

    def __init__(self, vectorsize, name):
        self.vectorsize = vectorsize
        self.name = name
        self.mapping = {}

    def train(self, items, num_trees):
        self.model = AnnoyIndex(self.vectorsize, 'angular')
        for item in items:
            name, vector = item

            if name not in self.mapping:
                if (len(self.mapping.items()) > 0):
                    highest_idx = max(self.mapping.items(), key=operator.itemgetter(1))[1]
                else:
                    highest_idx = 0
                print(f'Idx for {name}: {highest_idx}')
                self.mapping[name] = highest_idx + 1

            self.model.add_item(self.mapping[name], vector.detach().numpy().squeeze())

        try:
            self.model.build(num_trees)
        except:
            print("error")
        self.model.save(f'{self.name}.ann')

    def load(self):
        self.model = AnnoyIndex(self.vectorsize, 'angular')
        self.model.load(f'{self.name}.ann')

    def predict(self):
        pass
