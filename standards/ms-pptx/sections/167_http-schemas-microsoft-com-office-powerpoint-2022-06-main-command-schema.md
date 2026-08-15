<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2022/06/main/command Schema -->

## http://schemas.microsoft.com/office/powerpoint/2022/06/main/command Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2022/06/main/command" xmlns="http://schemas.microsoft.com/office/powerpoint/2022/06/main/command" xmlns:pc226="http://schemas.microsoft.com/office/powerpoint/2022/06/main/command" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:pc2="http://schemas.microsoft.com/office/powerpoint/2019/9/main/command" xmlns:ac="http://schemas.microsoft.com/office/drawing/2013/main/command" xmlns:s="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.microsoft.com/office/drawing/2013/main/command" schemaLocation="dml-cmd.xsd"/>
3.   <xsd:import namespace="http://schemas.microsoft.com/office/powerpoint/2019/9/main/command" schemaLocation="ms-pptxMonikerList2.xsd"/>
4.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes" schemaLocation="shared-commonSimpleTypes.xsd"/>
5.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
6.   <xsd:simpleType name="ST_CommentReplyV2ChangeBit">
7.     <xsd:restriction base="xsd:token">
8.       <xsd:enumeration value="add"/>
9.       <xsd:enumeration value="del"/>
10.       <xsd:enumeration value="mod"/>
11.       <xsd:enumeration value="modRxn"/>
12.     </xsd:restriction>
13.   </xsd:simpleType>
14.   <xsd:simpleType name="ST_CommentReplyV2ChangeBits">
15.     <xsd:list itemType="ST_CommentReplyV2ChangeBit"/>
16.   </xsd:simpleType>
17.   <xsd:complexType name="CT_CommentReplyV2Changes">
18.     <xsd:sequence>
19.       <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
20.       <xsd:element ref="pc2:cmRplyMkLst" minOccurs="1" maxOccurs="1"/>
21.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
22.     </xsd:sequence>
23.     <xsd:attribute name="chg" type="ST_CommentReplyV2ChangeBits" use="required"/>
24.   </xsd:complexType>
25.   <xsd:simpleType name="ST_CommentV2ChangeBit">
26.     <xsd:restriction base="xsd:token">
27.       <xsd:enumeration value="add"/>
28.       <xsd:enumeration value="del"/>
29.       <xsd:enumeration value="mod"/>
30.       <xsd:enumeration value="modTsk"/>
31.       <xsd:enumeration value="modRxn"/>
32.     </xsd:restriction>
33.   </xsd:simpleType>
34.   <xsd:simpleType name="ST_CommentV2ChangeBits">
35.     <xsd:list itemType="ST_CommentV2ChangeBit"/>
36.   </xsd:simpleType>
37.   <xsd:complexType name="CT_CommentV2Changes">
38.     <xsd:sequence>
39.       <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
40.       <xsd:element ref="pc2:cmMkLst" minOccurs="1" maxOccurs="1"/>
41.       <xsd:element name="cmRplyChg" type="CT_CommentReplyV2Changes" minOccurs="0" maxOccurs="unbounded"/>
42.       <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
43.     </xsd:sequence>
44.     <xsd:attribute name="chg" type="ST_CommentV2ChangeBits" use="required"/>
45.   </xsd:complexType>
46.   <xsd:element name="cmChg" type="CT_CommentV2Changes"/>
47. </xsd:schema>
