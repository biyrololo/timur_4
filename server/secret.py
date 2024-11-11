users = [
    {
        "name": 'Itralit',
        "password_hash": '89cd90c583607b6856cb6397527835ff74c1978759def10fc6c98b90efd808bb',
        "id": 1,
        'username': 'Тимур'
    },
    {
        "name": 'FideliS',
        "password_hash": '4e3789c266504a8ae5f7b8c82181632c0112fb198c97e7e0a10a893285bb9669',
        "id": 2,
        'username': 'Алексей'
    },
    {
        "name": 'gleb',
        "password_hash": '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5',
        "id": 3,
        'username': 'Глеб'
    },
    {
        'name': 'q',
        'password_hash': '8e35c2cd3bf6641bdb0e2050b76932cbb2e6034a0ddacc1d9bea82a6ba57f7cf',
        'id': 4,
        'username': 'Юра'
    }
]

def hash(x):
    import hashlib
    return hashlib.sha256(x.encode('utf-8')).hexdigest()


def check_password(name, password):
    for user in users:
        if user['name'] == name:
            return hash(password) == user['password_hash']
    return False

def get_id(name):
    for user in users:
        if user['name'] == name:
            return user['id']
    return None

def get_id_reverse(id):
    res = []
    for user in users:
        if user['id'] != id:
            res.append(user['id'])
    return res

def get_by(name, password):
    for user in users:
        if user['name'] == name:
            if user['password_hash'] == hash(password):
                return user
    return None