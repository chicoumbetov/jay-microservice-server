# Logic of message broker

1. here by path below in start file create message broker channel
   jay-microservice-server/customer/src/index.ts

```
 const channel = await CreateChannel();
```

2. Inject channel in express app:

```
await expressApp(app, channel);
```

3. Express app passing specific channel parameter to customer api

```
customer(app, channel);
```
