from .base import Base
from sqlalchemy import Column, Integer, String, LargeBinary, ARRAY

class StatisticModel(Base):
    __tablename__ = "statistic"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    value = Column(Integer, nullable=False)

    @classmethod
    def create(cls, db, statistic):
        s = cls(name=statistic['name'], value=statistic['value'])
        db.add(s)
        db.commit()
        return s.json()

    @classmethod
    def get_all(cls, db):
        return [i.json() for i in db.query(cls).all()]
    
    @classmethod
    def delete(cls, db, id):
        db.query(cls).filter(cls.id == id).delete()
        db.commit()

    @classmethod
    def edit(cls, db, statistic, id):
        statistic_ = db.query(cls).filter_by(id=id).first()
        statistic_.name = statistic.name
        statistic_.value = statistic.value
        db.commit()
        return statistic_.json()
    
    @classmethod
    def increment(cls, db, statistic, id):
        statistic_ = db.query(cls).filter_by(id=id).first()
        statistic_.value += statistic.value
        db.commit()
        return statistic_.json()

    @classmethod
    def create_if_not_exist(cls, db, statistic):
        s = cls.get_by_name(db, statistic['name'])
        if s:
            return s
        else:
            return cls.create(db, statistic)
    
    @classmethod
    def get_by_name(cls, db, name):
        t = db.query(cls).filter_by(name=name).first()
        if not t:
            return None
        else:
            return t
    
    @classmethod
    def edit_by_name(cls, db, statistic, name):
        statistic_ = cls.get_by_name(db, name)
        statistic_.name = statistic.name
        statistic_.value = statistic.value
        db.commit()

        return statistic_.json()

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "value": self.value
        }