from pydantic import BaseModel

class StatisticCreateSchema(BaseModel):
    name: str
    value: int

class StatisticSchema(StatisticCreateSchema):
    id: int