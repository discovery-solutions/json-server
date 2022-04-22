# Routes Reference

1. List all records by entity (with search)

```
GET /{entity}
```

2. Get single record by id

```
GET /{entity}/{id}
```

3. Update data of a single record by id

```
PATCH /{entity}/{id}
```

~~4. Update data of a multiple records~~ **(TODO)**

```
PUT /{entity}
```

5. Insert new record or multiple records

```
POST /{entity}
```

6. Delete record by id

```
DELETE /{entity}/{id}
```

~~7. Delete multiple records~~ **(TODO)**

```
DELETE /{entity}
```

8. List latest records

```
GET /{entity}/latest
```

9. List oldest records

```
GET /{entity}/oldest
```
