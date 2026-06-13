from backend.database import Base
print('tables before importing models:', list(Base.metadata.tables.keys()))
import models.user
print('tables after importing models (top-level import):', list(Base.metadata.tables.keys()))
