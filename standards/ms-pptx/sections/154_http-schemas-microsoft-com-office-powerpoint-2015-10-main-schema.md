<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2015/10/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2015/10/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2015/10/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2015/10/main" xmlns:p1510="http://schemas.microsoft.com/office/powerpoint/2015/10/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
3.   <xsd:simpleType name="ST_ClientID" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
4.     <xsd:restriction base="xsd:string"/>
5.   </xsd:simpleType>
6.   <xsd:simpleType name="ST_ClientRevisionNumber" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
7.     <xsd:restriction base="xsd:unsignedInt"/>
8.   </xsd:simpleType>
9.   <xsd:complexType name="CT_ClientRevision" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
10.     <xsd:attribute name="id" type="ST_ClientID" use="required"/>
11.     <xsd:attribute name="v" type="ST_ClientRevisionNumber" use="optional" default="0"/>
12.     <xsd:attribute name="vWet" type="ST_ClientRevisionNumber" use="optional" default="0"/>
13.     <xsd:attribute name="dt" type="xsd:dateTime" use="required"/>
14.   </xsd:complexType>
15.   <xsd:complexType name="CT_ClientRevisionList" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
16.     <xsd:sequence>
17.       <xsd:element name="client" type="CT_ClientRevision" minOccurs="0" maxOccurs="unbounded"/>
18.     </xsd:sequence>
19.   </xsd:complexType>
20.   <xsd:complexType name="CT_RevisionInfo" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
21.     <xsd:sequence>
22.       <xsd:element name="revLst" type="CT_ClientRevisionList" minOccurs="0" maxOccurs="1"/>
23.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
24.     </xsd:sequence>
25.   </xsd:complexType>
26.   <xsd:element name="revInfo" type="CT_RevisionInfo" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>
27. </xsd:schema>
