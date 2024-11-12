from pydantic import BaseModel

class StatisticCreateSchema(BaseModel):
    name: str
    value: int
    date: str

class StatisticSchema(StatisticCreateSchema):
    id: int