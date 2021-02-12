import pickle

class Database:
    def __init__(self):
        self.database = {}
        pass

    def __len__(self):
        return len(list(self.database.keys()))

    def exists(self, name):
        return name in self.database

    def add_to_db(self, name, embedding):
        if self.exists(name):
            self.database[name].append(embedding)
        else:
            self.database[name] = [embedding]

    def delete_from_db(self, name):
        if self.exists(name):
            self.database[name] = None
        else:
            raise Exception('Name does not exist in database')

    def clear_database(self):
        self.database = {}

    def to_file(self, name):
        with open(name + '.pkl', 'wb') as f:
            pickle.dump(self.database, f, pickle.HIGHEST_PROTOCOL)

    def load_from_file(self, name):
        with open(name+'.pkl', 'rb') as f:
            self.database = pickle.load(f)