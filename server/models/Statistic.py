from .base import Base
from sqlalchemy import Column, Integer, String, LargeBinary, ARRAY

class Statistic(Base):
    __tablename__ = "statistic"
    id = Column(Integer, primary_key=True)
    ads = Column(Integer)
    
def get_statistic(db):
    a = db.query(Statistic).all()
    if a is None:
        return None
    else:
        if len(a) == 0:
            return None
        else:
            return a[-1]

def set_statistic(db, ads):
    # add ads to first
    statistic = get_statistic(db)
    if not statistic:
        statistic = Statistic(ads=ads)
        db.add(statistic)
    else:
        statistic.ads = statistic.ads + ads
    db.commit()