<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2017/3/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2017/3/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2017/3/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2017/3/main" xmlns:p173="http://schemas.microsoft.com/office/powerpoint/2017/3/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="dml-main.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
4.   <xsd:simpleType name="ST_DisplayLocation">
5.     <xsd:restriction base="xsd:string">
6.       <xsd:enumeration value="media"/>
7.       <xsd:enumeration value="slide"/>
8.     </xsd:restriction>
9.   </xsd:simpleType>
10.   <xsd:complexType name="CT_Track">
11.     <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
12.     <xsd:attribute name="label" type="xsd:string" use="required"/>
13.     <xsd:attribute name="lang" type="a:ST_TextLanguageID" use="optional"/>
14.     <xsd:attributeGroup ref="a:AG_Blob"/>
15.   </xsd:complexType>
16.   <xsd:complexType name="CT_TrackList">
17.     <xsd:sequence>
18.       <xsd:element name="track" type="CT_Track" minOccurs="0" maxOccurs="unbounded"/>
19.     </xsd:sequence>
20.   </xsd:complexType>
21.   <xsd:complexType name="CT_TracksInfo">
22.     <xsd:sequence>
23.       <xsd:element name="trackLst" type="CT_TrackList" minOccurs="0" maxOccurs="1"/>
24.     </xsd:sequence>
25.     <xsd:attribute name="displayLoc" type="ST_DisplayLocation" use="required"/>
26.   </xsd:complexType>
27.   <xsd:element name="tracksInfo" type="CT_TracksInfo"/>
28. </xsd:schema>
