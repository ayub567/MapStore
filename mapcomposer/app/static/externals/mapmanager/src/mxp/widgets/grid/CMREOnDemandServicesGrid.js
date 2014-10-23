/*
 *  Copyright (C) 2007 - 2014 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 *  GPLv3 + Classpath exception
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/** api: (define)
 *  module = mxp.widgets
 *  class = CMREOnDemandServicesGrid
 *  
 */
Ext.ns('mxp.widgets');

/**
 * Class: CMREOnDemandServicesGrid
 * Grid panel that shows the list of flows.
 * Selection Model can be attached to get the data of a flow.
 * 
 * GeoBatch REST API used
 * * (GET) "/flows" : list of flows 
 * * (GET) "/flows/{flowid}" : details about the flow
 * * (GET) "/flows/{flowId}/consumers" : the consumers for the flow
 * * (GET) "/consumers/{consumerid}/status" : the status of a consumer
 * * (GET) "/consumers/{consumerid}/log" the log of a consumer
 * * (PUT) "/consumers/{consumerid}/pause" pause the consumer 
 * * (PUT) "/consumers/{consumerid}/resume" resume a paused consumer
 * * (PUT) "/consumers/{consumerid}/clean" clean the consumer 
 *
 * Inherits from:
 *  - <Ext.grid.GridPanel>
 *
 */
mxp.widgets.CMREOnDemandServicesGrid = Ext.extend(Ext.grid.GridPanel, {

    /** api: xtype = mxp_viewport */
    xtype: "mxw_cmre_ondemand_services_grid",
    
     /**
	 * Property: geoBatchRestURL
	 * {string} the GeoBatch ReST Url
	 */
    geoBatchRestURL: 'http://localhost:8180/opensdi2-manager/mvc/rest/geobatch/',
    autoload:true,
    /* i18n */
    nameText: 'Title',
    descriprionText:'descriprion',
    autoExpandColumn: 'descriprion',
    loadingMessage: 'Loading...',
    /* end of i18n */
    //extjs grid specific config
    autoload:true,
    loadMask:true,
    
   
    initComponent : function() {
        //FIX FOR IE10 and responseXML TODO: port this as a global fix
         var ie10XmlStore  = Ext.extend(Ext.data.JsonReader, {
            read : function(response){
            	debugger
                        var data = response.responseText;
                        if(!data || !data.documentElement) {
                            if(window.ActiveXObject) {
                                var doc = new ActiveXObject("Microsoft.XMLDOM");
                                if(doc.loadXML(response.responseText)){
                                    data = doc;
                                }
                            }
                        }
                        return this.readRecords(data);
                    }
        });
        // create the Data Store
        this.store = new Ext.data.Store({
            autoLoad: this.autoload,
            // load using HTTP
            url: this.geoBatchRestURL + 'services/',
            record: 'service',
            idPath: 'serviceId',
            fields: [
                   'serviceId',
                   'name',
                   'descriprion'
           ],
            /*reader:  new ie10XmlStore({
                record: 'flow',
                idPath: 'uuid',
                fields: [
                   'id',
                   'name',
                   'descriprion']
            }),*/
            reader: new Ext.data.JsonReader({
            	root: 'data',
            	idPath: 'serviceId',
            	fields: [
                   'serviceId',
                   'name',
                   'descriprion']
            }),
            listeners:{
                beforeload: function(a,b,c){
                   
                    if( a.proxy.conn.headers ){
                        if(this.auth){
                            a.proxy.conn.headers['Authorization'] = this.auth;
                        }
                        a.proxy.conn.headers['Accept'] = 'application/json';
                    }else{
                        a.proxy.conn.headers = {'Accept': 'application/json'};
                        if(this.auth){
                            a.proxy.conn.headers['Authorization'] = this.auth;
                        }
                    }
                   
                }
            },
            sortInfo: {
                field: 'serviceId',
                direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
            }
        });
    
    
        this.tbar = this.tbar || [];
        this.tbar.push({
            iconCls:'refresh_ic',
            xtype:'button',
            text:this.refreshText,
            scope:this,
            handler:function(){
                this.store.load();
            }
        });
        
        
        this.columns= [
            {id: 'id', header: "ID", width: 100, dataIndex: 'serviceId', sortable: true,hidden:true},
            {id: 'name', header: this.nameText, width: 200, dataIndex: 'name', sortable: true},
            {id: 'descriprion', header: this.descriprionText, dataIndex: 'descriprion', sortable: true}
        ],
        mxp.widgets.CMREOnDemandServicesGrid.superclass.initComponent.call(this, arguments);
    }
   
    
});

/** api: xtype = mxp_geobatch_consumer_grid */
Ext.reg(mxp.widgets.CMREOnDemandServicesGrid.prototype.xtype, mxp.widgets.CMREOnDemandServicesGrid);