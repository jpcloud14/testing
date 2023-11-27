public class LeadTriggerHelper {
    public static void afterInsert(List<Lead> ldList){
        
        Boolean flag = false;
        for(Lead ld : ldList){
            if(ld.Status == 'Open - Not Contacted'){
                flag = true;
            }
        }
        System.debug('flag:- '+flag);
        if(flag == true){
            sendSmsViaSlickText();
        }
    }
    
    public static void afterUpdate(List<Lead> ldList,Map<Id,Lead> oldMap){
        
        Boolean flag = false;
        for(Lead ld : ldList){
            if(ld.Status != oldMap.get(ld.Id).Status && ld.Status != 'Open - Not Contacted'){
                flag = true;   
            }
        }
        
        if(flag == true){
            outOutContact();
        }
    }
    @future(Callout=true)
    public static void sendSmsViaSlickText(){  
        System.debug('calling future');
        
        SlickText__c slkTxt = [select UserName__c, Password__c from SlickText__c WHERE Name ='Authorization Credentials'];
        System.debug('slkTxt:- '+slkTxt);
        
        if(slkTxt != NULL){
            String payload,action,txtWord,contactNumber,body;
            String username = slkTxt.UserName__c;
            String password = SLKTXT.Password__c;
            
            Blob headerValue = Blob.valueOf(username + ':' + password);
            String authorizationHeader = 'BASIC ' + EncodingUtil.base64Encode(headerValue);
            System.debug('authorizationHeader:- '+authorizationHeader);
            
            //opt in Contact
            action='OPTIN';txtWord='3802797';contactNumber='19209600713';
            
            payload = 'action='+EncodingUtil.urlEncode(action,'UTF-8')+
                +'&textword='+EncodingUtil.urlEncode(txtWord,'UTF-8')+
                +'&number='+EncodingUtil.urlEncode(contactNumber,'UTF-8');
            System.debug(payload);
            
            HttpRequest optInRequest = new HttpRequest();
            optInRequest.setEndpoint('https://api.slicktext.com/v1/contacts');
            optInRequest.setMethod('POST');
            optInRequest.setHeader('Authorization', authorizationHeader);
            optInRequest.setBody(payload);
            System.debug('optInRequest:- '+optInRequest);
            Http http = new Http();
            HttpResponse optInResponse = http.send(optInRequest);
            System.debug('opt in response:- '+optInResponse.getBody());
            if (optInResponse.getStatusCode() == 200) {
                
                //sendSMS
                
                action='SEND';txtWord='3802797';body='test Message';contactNumber='19209600713';
                
                payload = 'action='+EncodingUtil.urlEncode(action,'UTF-8')+
                    +'&textword='+EncodingUtil.urlEncode(txtWord,'UTF-8')+
                    +'&body='+EncodingUtil.urlEncode(body,'UTF-8')+
                    +'&number='+EncodingUtil.urlEncode(contactNumber,'UTF-8');
                
                System.debug(payload);
                HttpRequest sendSmsReq = new HttpRequest();
                sendSmsReq.setEndpoint('https://api.slicktext.com/v1/messages');
                sendSmsReq.setMethod('POST');
                sendSmsReq.setHeader('Authorization', authorizationHeader);
                sendSmsReq.setBody(payload);
                System.debug('sendSmsReq:- '+sendSmsReq);
                //Http http = new Http();
                HttpResponse sendSmsResponse = http.send(sendSmsReq);
                System.debug(sendSmsResponse.getBody());
                
            } else {
                System.debug('The status code returned was not expected: ' + optInResponse.getStatusCode() + ' ' + optInResponse.getStatus());
            }
        }
    }
    
    @future(Callout=true)
    public static void outOutContact(){
        SlickText__c slkTxt = [select UserName__c, Password__c from SlickText__c WHERE Name ='Authorization Credentials'];
        System.debug('slkTxt:- '+slkTxt);
        
        if(slkTxt != NULL){
            String txtWord='3802797';
            String username = slkTxt.UserName__c;
            String password = SLKTXT.Password__c;
            
            Blob headerValue = Blob.valueOf(username + ':' + password);
            String authorizationHeader = 'BASIC ' + EncodingUtil.base64Encode(headerValue);
            System.debug('authorizationHeader:- '+authorizationHeader);
            String endPointUrl = 'https://api.slicktext.com/v1/contacts/'+txtWord;
            System.debug('endPointUrl:- '+endPointUrl);
            HttpRequest optOutRequest = new HttpRequest();
            optOutRequest.setEndpoint(endPointUrl);
            optOutRequest.setMethod('POST');
            optOutRequest.setHeader('Authorization', authorizationHeader);
            System.debug('optOutRequest:- '+optOutRequest);
            Http http = new Http();
            HttpResponse optOutResponse = http.send(optOutRequest);
            System.debug('opt in response:- '+optOutResponse.getBody());
            if (optOutResponse.getStatusCode() == 200) {
                System.debug('Success');  
            } else {
                System.debug('The status code returned was not expected: ' + optOutResponse.getStatusCode() + ' ' + optOutResponse.getStatus());
            }
        }
    }
}