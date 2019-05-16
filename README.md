# damazon
Inventory/Sales node.js system

## Summary:
* Simple inventory system in node js. Allows user to buy from a list of products, updates database accordingly, doesn't allow buy more than in stock and queries items low in inventory (below threshold). 

### According to your user type (manger or not manager), the following actions will be available:

### Admin actions:
* Buy products 
* View low inventory - Each product has a threshold, it will show in low inventory once it has less items in stock than the thershold.

### User Actions:
* Buy products. No menu is shown, just the list of products to buy

### Test users (in demo): 
* laurab - admin
* danielm - not admin user

### Error Control - System controls errors like:
* User not found (must enter an existing user, does not have create user functionality)
* Product Id not found (must enter from the list displayed)
* Desired product quatity surpases stock quantity (stock quantity will be displayed for information but won't add anything into the order)
* DB errors caught in promises and passed to console. 


## Design: 
* Database access in managed in Connection Manager object
* Business logic is managed by the corresponding business product
* Catalog and Managers control business objects logic


* View demo: https://drive.google.com/file/d/1_cTebQHLGqPoWPwdCbwFNi0QlIsCsBO7/view

