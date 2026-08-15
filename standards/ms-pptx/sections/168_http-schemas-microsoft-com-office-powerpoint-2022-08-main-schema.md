<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2022/08/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2022/08/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2022/08/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2022/08/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p188="http://schemas.microsoft.com/office/powerpoint/2018/8/main" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:complexType name="CT_TaskScheduleEventInfo" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:odoc="http://schemas.microsoft.com/internal/obd">
3.     <xsd:attribute name="stDt" type="xsd:dateTime" use="optional"/>
4.     <xsd:attribute name="endDt" type="xsd:dateTime" use="optional"/>
5.   </xsd:complexType>
6.   <xsd:complexType name="CT_TaskProgressEventInfo" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:odoc="http://schemas.microsoft.com/internal/obd">
7.     <xsd:attribute name="val" type="s:ST_PositiveFixedPercentage" use="required"/>
8.   </xsd:complexType>
9.   <xsd:complexType name="CT_TaskTitleEventInfo" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:odoc="http://schemas.microsoft.com/internal/obd">
10.     <xsd:attribute name="val" type="xsd:string" use="required"/>
11.   </xsd:complexType>
12.   <xsd:complexType name="CT_TaskAssignUnassignUser" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:odoc="http://schemas.microsoft.com/internal/obd">
13.     <xsd:attribute name="authorId" type="p188:ST_AuthorId" use="required"/>
14.   </xsd:complexType>
15.   <xsd:complexType name="CT_TaskUnknownRecord" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:odoc="http://schemas.microsoft.com/internal/obd"/>
16.   <xsd:complexType name="CT_CommentAnchor" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:odoc="http://schemas.microsoft.com/internal/obd">
17.     <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
18.   </xsd:complexType>
19.   <xsd:complexType name="CT_TaskAnchor" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:odoc="http://schemas.microsoft.com/internal/obd">
20.     <xsd:sequence>
21.       <xsd:element name="comment" type="CT_CommentAnchor" minOccurs="1" maxOccurs="1"/>
22.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
23.     </xsd:sequence>
24.   </xsd:complexType>
25.   <xsd:complexType name="CT_TaskUndo" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:odoc="http://schemas.microsoft.com/internal/obd">
26.     <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
27.   </xsd:complexType>
28.   <xsd:complexType name="CT_TaskHistoryEvent" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:odoc="http://schemas.microsoft.com/internal/obd">
29.     <xsd:sequence>
30.       <xsd:element name="atrbtn" type="CT_TaskAssignUnassignUser" minOccurs="1" maxOccurs="1"/>
31.       <xsd:element name="anchr" type="CT_TaskAnchor" minOccurs="0" maxOccurs="1"/>
32.       <xsd:choice minOccurs="0" maxOccurs="1">
33.         <xsd:element name="asgn" type="CT_TaskAssignUnassignUser" minOccurs="1" maxOccurs="1"/>
34.         <xsd:element name="add" type="p:CT_Empty" minOccurs="0" maxOccurs="1"/>
35.         <xsd:element name="title" type="CT_TaskTitleEventInfo" minOccurs="1" maxOccurs="1"/>
36.         <xsd:element name="date" type="CT_TaskScheduleEventInfo" minOccurs="1" maxOccurs="1"/>
37.         <xsd:element name="pcntCmplt" type="CT_TaskProgressEventInfo" minOccurs="1" maxOccurs="1"/>
38.         <xsd:element name="unasgnAll" type="p:CT_Empty" minOccurs="0" maxOccurs="1"/>
39.         <xsd:element name="undo" type="CT_TaskUndo" minOccurs="1" maxOccurs="1"/>
40.         <xsd:element name="unknown" type="CT_TaskUnknownRecord" minOccurs="1" maxOccurs="1"/>
41.       </xsd:choice>
42.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
43.     </xsd:sequence>
44.     <xsd:attribute name="time" type="xsd:dateTime" use="required"/>
45.     <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
46.   </xsd:complexType>
47.   <xsd:complexType name="CT_TaskHistory" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:odoc="http://schemas.microsoft.com/internal/obd">
48.     <xsd:sequence>
49.       <xsd:element name="event" type="CT_TaskHistoryEvent" minOccurs="0" maxOccurs="unbounded"/>
50.     </xsd:sequence>
51.   </xsd:complexType>
52.   <xsd:complexType name="CT_TaskDetails" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:odoc="http://schemas.microsoft.com/internal/obd">
53.     <xsd:sequence>
54.       <xsd:element name="history" type="CT_TaskHistory" minOccurs="1" maxOccurs="1"/>
55.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
56.     </xsd:sequence>
57.   </xsd:complexType>
58.   <xsd:element name="taskDetails" type="CT_TaskDetails" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:odoc="http://schemas.microsoft.com/internal/obd"/>
59. </xsd:schema>
