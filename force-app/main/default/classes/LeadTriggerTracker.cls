@isTest
public class LeadTriggerTracker {
    
    @testSetup
    public static void Setup(){
        
        Test.setMock(HttpCalloutMock.class, new ExampleCalloutMock());
        SlickText__c slkTxt = new SlickText__c();
        slkTxt.Name = 'Authorization Credentials';
        slkTxt.UserName__c = 'testUser';
        slkTxt.Password__c = 'testPassword';
        insert slkTxt;
        
        Lead ld = new Lead();
        ld.LastName = 'testLead';
        ld.Company = 'JP Cloud';
        insert ld;
        
        ld.LastName = 'updatedLead';
        ld.status = 'Working - Contacted';
        update ld;
    }
    
    @isTest
    public static void testOne(){
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new ExampleCalloutMock());
        Test.stopTest();
    }
}