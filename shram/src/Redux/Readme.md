CallApi
the following are the parameter
action=name of the action.
Note= make sure to follow the naming convention.there are three dispatch called during api calling that is loading ,success ,fail
on loading "\_Loading" is append to the action and dispatched
on Success "\_Success" is appended to the action and the data recieved from api is dispatched
on Success "\_Failure" is appended to the action and the error is dispatched

method=name of the method to be called

body=the data that has to be sent to api

successcallback=the callback called when api is called successfully

faillcallback=the callback called where there was an error

example:dispatch(
callApi(
'City',
'http://3.6.108.152:3010/login',
{
mobileEmail: '8689903688',
password: 'abcdef',
},
() => alert('called'),
() => alert('fails'),
),
);

callDatabase
the following are the parameter

action=name of the action.
Note= make sure to follow the naming convention.there are three dispatch called during api calling that is loading ,success ,fail
on loading "\_Loading" is append to the action and dispatched
on Success "\_Success" is appended to the action and the data recieved from api is dispatched
on Success "\_Failure" is appended to the action and the error is dispatched

operationType=defile wat operation you need perform you can get the types from constants,
schema=pass all the schema required got perform ,
payload=only required in update and insert type.
if type is update then pass an object
if type is insert then pass an array

qry=the condition to be passsed when get or uodate or delete is called

successcallback=the callback called when api is called successfully

faillcallback=the callback called where there was an error

example = dispatch(
callDatabase(
'City',
'get',
'TaskListEntity',
[],
'',
() => alert('yes'),
() => alert('no'),
),
);
