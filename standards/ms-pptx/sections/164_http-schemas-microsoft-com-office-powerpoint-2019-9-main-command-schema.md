<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2019/9/main/command Schema -->

## http://schemas.microsoft.com/office/powerpoint/2019/9/main/command Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2019/9/main/command" xmlns="http://schemas.microsoft.com/office/powerpoint/2019/9/main/command" xmlns:pc2="http://schemas.microsoft.com/office/powerpoint/2019/9/main/command" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p188="http://schemas.microsoft.com/office/powerpoint/2018/8/main">
2.   <xsd:import namespace="http://schemas.microsoft.com/office/powerpoint/2018/8/main" schemaLocation="ms-pptx188.xsd"/>
3.   <xsd:complexType name="CT_CommentV2MonikerList">
4.     <xsd:sequence>
5.       <xsd:any minOccurs="0" maxOccurs="unbounded"/>
6.     </xsd:sequence>
7.   </xsd:complexType>
8.   <xsd:complexType name="CT_CommentReplyV2MonikerList">
9.     <xsd:sequence>
10.       <xsd:any minOccurs="0" maxOccurs="unbounded"/>
11.     </xsd:sequence>
12.   </xsd:complexType>
13.   <xsd:element name="cmMkLst" type="CT_CommentV2MonikerList"/>
14.   <xsd:element name="cmRplyMkLst" type="CT_CommentReplyV2MonikerList"/>
15.   <xsd:complexType name="CT_CommentV2Moniker">
16.     <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
17.   </xsd:complexType>
18.   <xsd:complexType name="CT_CommentReplyV2Moniker">
19.     <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
20.   </xsd:complexType>
21. </xsd:schema>
