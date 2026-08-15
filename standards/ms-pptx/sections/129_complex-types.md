<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_1a74c93050b74c0399661b77b42a9a76"></a><a id="_Toc174686151"></a>CT_CommentAnchor

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/08/main

*Referenced by: *[CT_TaskAnchor](#Section_2753253b895e4891bb5822c09aeee2b2)

<a id="CC_21638ba9000000000000000000000000"></a>A complex type that specifies the comment or reply in which the task related action was performed.

*Attributes:*

<a id="CC_b718c039000000000000000000000000"></a>__id: __A s:ST_Guid ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.8.9) attribute that specifies the id of the comment or reply in which the task related action was performed.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentAnchor">
2.   <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
3. </xsd:complexType>

See section [5.19](#Section_553f8c1bd46b4f15ab68ee241748605a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_2753253b895e4891bb5822c09aeee2b2"></a><a id="_Toc174686152"></a>CT_TaskAnchor

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/08/main

*Referenced by: *[CT_TaskHistoryEvent](#Section_e430f4dc1adc4ede870e7ec5091b167a)

<a id="CC_74c159c1000000000000000000000000"></a>A complex type that specifies information about the task event’s anchor.

*Child Elements:*

<a id="CC_9cb87a15000000000000000000000000"></a>__comment: __A [CT_CommentAnchor](#Section_1a74c93050b74c0399661b77b42a9a76) element that specifies the comment or reply in which the task related action was performed.

<a id="CC_38f2d2cf000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.3) element that specifies the extension list. All future extensions to the task anchor will be stored in the extension list. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TaskAnchor">
2.   <xsd:sequence>
3.     <xsd:element name="comment" type="CT_CommentAnchor" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6. </xsd:complexType>

See section [5.19](#Section_553f8c1bd46b4f15ab68ee241748605a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_a53798916a5b471d95281a86bcc42100"></a><a id="_Toc174686153"></a>CT_TaskAssignUnassignUser

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/08/main

*Referenced by: *[CT_TaskHistoryEvent](#Section_e430f4dc1adc4ede870e7ec5091b167a)

<a id="CC_96410de7000000000000000000000000"></a>A complex type that specifies the identity details of the person who the task event is attributed.

*Attributes:*

<a id="CC_2a1e41d8000000000000000000000000"></a>__authorId: __An [ST_AuthorId](#Section_30fd68c67eb5479cacf773632431b459) attribute that specifies the document author id for the person who the task event is attributed.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TaskAssignUnassignUser">
2.   <xsd:attribute name="authorId" type="p188:ST_AuthorId" use="required"/>
3. </xsd:complexType>

See section [5.19](#Section_553f8c1bd46b4f15ab68ee241748605a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_c3d142e9a890433aaa0cd976e5c0cf5b"></a><a id="_Toc174686154"></a>CT_TaskDetails

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/08/main

*Referenced by: *[taskDetails](#Section_e38f73d80d6545f397ece5fd3195cce3)

<a id="CC_6d9a29ae000000000000000000000000"></a>An element that contains additional task details.

*Child Elements:*

<a id="CC_415e1860000000000000000000000000"></a>__history: __A [CT_TaskHistory](#Section_e6f47d38770c454ca5f33ba93addbd24) element that specifies the history of the changes made to the task.

<a id="CC_5a8cc8f5000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.3) element that specifies the extension list. All future extensions to the task details will be stored in the extension list.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TaskDetails">
2.   <xsd:sequence>
3.     <xsd:element name="history" type="CT_TaskHistory" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6. </xsd:complexType>

See section [5.19](#Section_553f8c1bd46b4f15ab68ee241748605a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_e6f47d38770c454ca5f33ba93addbd24"></a><a id="_Toc174686155"></a>CT_TaskHistory

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/08/main

*Referenced by: *[CT_TaskDetails](#Section_c3d142e9a890433aaa0cd976e5c0cf5b)

<a id="CC_b96485c9000000000000000000000000"></a>A complex type that specifies a sequence of events that record changes done to the task.

*Child Elements:*

<a id="CC_01ad4dde000000000000000000000000"></a>__event: __A [CT_TaskHistoryEvent](#Section_e430f4dc1adc4ede870e7ec5091b167a) element that specifies a single change made to a task.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TaskHistory">
2.   <xsd:sequence>
3.     <xsd:element name="event" type="CT_TaskHistoryEvent" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.19](#Section_553f8c1bd46b4f15ab68ee241748605a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_e430f4dc1adc4ede870e7ec5091b167a"></a><a id="_Toc174686156"></a>CT_TaskHistoryEvent

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/08/main

*Referenced by: *[CT_TaskHistory](#Section_e6f47d38770c454ca5f33ba93addbd24)

<a id="CC_bc03732e000000000000000000000000"></a>A complex type that specifies a single kind of change done to a task.

*Child Elements:*

<a id="CC_6202b7d0000000000000000000000000"></a>__atrbtn: __A [CT_TaskAssignUnassignUser](#Section_a53798916a5b471d95281a86bcc42100) element that specifies the author id of the user who initiated the change.

<a id="CC_63abfc3d000000000000000000000000"></a>__anchr: __A [CT_TaskAnchor](#Section_2753253b895e4891bb5822c09aeee2b2) element that specifies the object type to which the change is related.

<a id="CC_7b689360000000000000000000000000"></a>__asgn: __A CT_TaskAssignUnassignUser element that specifies the event record created when a task is assigned to a particular person.

<a id="CC_e748624c000000000000000000000000"></a>__add: __A p:CT_Empty ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) element that specifies the event record created when a task is created. 

<a id="CC_eafb6b20000000000000000000000000"></a>__title: __A [CT_TaskTitleEventInfo](#Section_42dcd77fcd564fb7bd09e4705137c977) element that specifies the event record created when a task title is specified.

<a id="CC_d7b2c63f000000000000000000000000"></a>__date: __A [CT_TaskScheduleEventInfo](#Section_32069c75defe45d2b04c793067011d04) element that specifies the event record created when a task schedule is changed.

<a id="CC_c18456cc000000000000000000000000"></a>__pcntCmplt: __A [CT_TaskProgressEventInfo](#Section_7bdf2eb9eacc4bed867c984a66d5ed0c) element that specifies the event record created when a task progress changes. 

<a id="CC_ec002797000000000000000000000000"></a>__unasgnAll: __A p:CT_Empty ([ISO/IEC29500-4:2016] section A.4) element that specifies the event record created when a task has been unassigned from all persons.

<a id="CC_73c82416000000000000000000000000"></a>__undo: __A [CT_TaskUndo](#Section_8a2dfb1afe064b0ba8e7ed1e2fb88ac3) element that specifies the event record created when a task event record is undone.

<a id="CC_45b445ce000000000000000000000000"></a>__unknown: __A [CT_TaskUnknownRecord](#Section_1661013575164b078315eb9753f71978) element that specifies the event record created when a task has an unknown change. This is for future extension.

<a id="CC_c22150df000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.3) element that specifies the extension list. All future extensions to the task history will be stored in the extension list. 

*Attributes:*

<a id="CC_2bd05d36000000000000000000000000"></a>__time: __A xsd:dateTime ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.7) attribute that specifies the time, in UTC, that the task change occurred. 

<a id="CC_772fba50000000000000000000000000"></a>__id: __A s:ST_Guid ([ISO/IEC-29500-4] section A.8.9) attribute that specifies the unique id for this change event.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TaskHistoryEvent">
2.   <xsd:sequence>
3.     <xsd:element name="atrbtn" type="CT_TaskAssignUnassignUser" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="anchr" type="CT_TaskAnchor" minOccurs="0" maxOccurs="1"/>
5.     <xsd:choice minOccurs="0" maxOccurs="1">
6.       <xsd:element name="asgn" type="CT_TaskAssignUnassignUser" minOccurs="1" maxOccurs="1"/>
7.       <xsd:element name="add" type="p:CT_Empty" minOccurs="0" maxOccurs="1"/>
8.       <xsd:element name="title" type="CT_TaskTitleEventInfo" minOccurs="1" maxOccurs="1"/>
9.       <xsd:element name="date" type="CT_TaskScheduleEventInfo" minOccurs="1" maxOccurs="1"/>
10.       <xsd:element name="pcntCmplt" type="CT_TaskProgressEventInfo" minOccurs="1" maxOccurs="1"/>
11.       <xsd:element name="unasgnAll" type="p:CT_Empty" minOccurs="0" maxOccurs="1"/>
12.       <xsd:element name="undo" type="CT_TaskUndo" minOccurs="1" maxOccurs="1"/>
13.       <xsd:element name="unknown" type="CT_TaskUnknownRecord" minOccurs="1" maxOccurs="1"/>
14.     </xsd:choice>
15.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
16.   </xsd:sequence>
17.   <xsd:attribute name="time" type="xsd:dateTime" use="required"/>
18.   <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
19. </xsd:complexType>

See section [5.19](#Section_553f8c1bd46b4f15ab68ee241748605a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_7bdf2eb9eacc4bed867c984a66d5ed0c"></a><a id="_Toc174686157"></a>CT_TaskProgressEventInfo

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/08/main

*Referenced by: *[CT_TaskHistoryEvent](#Section_e430f4dc1adc4ede870e7ec5091b167a)

<a id="CC_f1fb0c2b000000000000000000000000"></a>A complex type that specifies information about the task progression. 

*Attributes:*

<a id="CC_22c3ec0b000000000000000000000000"></a>__val: __A s:ST_PositiveFixedPercentage ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.8.9) attribute that specifies the whole number value representing the percent complete for the task (0-100).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TaskProgressEventInfo">
2.   <xsd:attribute name="val" type="s:ST_PositiveFixedPercentage" use="required"/>
3. </xsd:complexType>

See section [5.19](#Section_553f8c1bd46b4f15ab68ee241748605a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_32069c75defe45d2b04c793067011d04"></a><a id="_Toc174686158"></a>CT_TaskScheduleEventInfo

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/08/main

*Referenced by: *[CT_TaskHistoryEvent](#Section_e430f4dc1adc4ede870e7ec5091b167a)

<a id="CC_df99e763000000000000000000000000"></a>A complex type that specifies information about the task schedule.

*Attributes:*

<a id="CC_3301c3c6000000000000000000000000"></a>__stDt: __A xsd:dateTime ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.7) attribute that specifies the DateTime, in UTC, when the task assigned was scheduled to start. If this attribute is omitted, there is no start date. 

<a id="CC_1c82ca47000000000000000000000000"></a>__endDt: __A xsd:dateTime ([XMLSCHEMA2/2] section 3.2.7) attribute that specifies the DateTime, in UTC, when the assigned task is due. If this attribute is omitted, there is no due date. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TaskScheduleEventInfo">
2.   <xsd:attribute name="stDt" type="xsd:dateTime" use="optional"/>
3.   <xsd:attribute name="endDt" type="xsd:dateTime" use="optional"/>
4. </xsd:complexType>

See section [5.19](#Section_553f8c1bd46b4f15ab68ee241748605a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_42dcd77fcd564fb7bd09e4705137c977"></a><a id="_Toc174686159"></a>CT_TaskTitleEventInfo

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/08/main

*Referenced by: *[CT_TaskHistoryEvent](#Section_e430f4dc1adc4ede870e7ec5091b167a)

<a id="CC_89e827b5000000000000000000000000"></a>A complex type that specifies information about a task title change.

*Attributes:*

<a id="CC_899949e7000000000000000000000000"></a>__val: __A xsd:string ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) attribute that specifies the title for the task. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TaskTitleEventInfo">
2.   <xsd:attribute name="val" type="xsd:string" use="required"/>
3. </xsd:complexType>

See section [5.19](#Section_553f8c1bd46b4f15ab68ee241748605a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_8a2dfb1afe064b0ba8e7ed1e2fb88ac3"></a><a id="_Toc174686160"></a>CT_TaskUndo

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/08/main

*Referenced by: *[CT_TaskHistoryEvent](#Section_e430f4dc1adc4ede870e7ec5091b167a)

<a id="CC_ca4abebc000000000000000000000000"></a>A complex type that specifies a task change that has been undone. 

*Attributes:*

<a id="CC_c6c50210000000000000000000000000"></a>__id: __A s:ST_Guid ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.8.9) attribute that specifies the unique id of the history record that is being undone via this record.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TaskUndo">
2.   <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
3. </xsd:complexType>

See section [5.19](#Section_553f8c1bd46b4f15ab68ee241748605a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_1661013575164b078315eb9753f71978"></a><a id="_Toc174686161"></a>CT_TaskUnknownRecord

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/08/main

*Referenced by: *[CT_TaskHistoryEvent](#Section_e430f4dc1adc4ede870e7ec5091b167a)

<a id="CC_cae0aa0d000000000000000000000000"></a>A complex type that specifies an unknown record in task history. This is for future extension.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TaskUnknownRecord"/>

See section [5.19](#Section_553f8c1bd46b4f15ab68ee241748605a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
