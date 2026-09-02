class VisionModelService:
    def __init__(self):
        self.model = None

    def load_model(self):
        raise NotImplementedError("Vision model is not configured yet.")

    def analyze(self, image):
        raise NotImplementedError("Vision model analysis is not implemented yet.")
    