__[MS-OWEXML]: __

__Office Web Extensibility Extensions to Office Open XML Structure Specification__

Intellectual Property Rights Notice for Open Specifications Documentation

- __Technical Documentation. __Microsoft publishes Open Specifications documentation (“this documentation”) for protocols, file formats, data portability, computer languages, and standards support. Additionally, overview documents cover inter-protocol relationships and interactions. 
- __Copyrights__. This documentation is covered by Microsoft copyrights. Regardless of any other terms that are contained in the terms of use for the Microsoft website that hosts this documentation, you can make copies of it in order to develop implementations of the technologies that are described in this documentation and can distribute portions of it in your implementations that use these technologies or in your documentation as necessary to properly document the implementation. You can also distribute in your implementation, with or without modification, any schemas, IDLs, or code samples that are included in the documentation. This permission also applies to any documents that are referenced in the Open Specifications documentation. 
- __No Trade Secrets__. Microsoft does not claim any trade secret rights in this documentation. 
- __Patents__. Microsoft has patents that might cover your implementations of the technologies described in the Open Specifications documentation. Neither this notice nor Microsoft's delivery of this documentation grants any licenses under those patents or any other Microsoft patents. However, a given Open Specifications document might be covered by the Microsoft [Open Specifications Promise](https://go.microsoft.com/fwlink/?LinkId=214445) or the [Microsoft Community Promise](https://go.microsoft.com/fwlink/?LinkId=214448). If you would prefer a written license, or if the technologies described in this documentation are not covered by the Open Specifications Promise or Community Promise, as applicable, patent licenses are available by contacting [iplg@microsoft.com](mailto:iplg@microsoft.com). 
- __License Programs__. To see all of the protocols in scope under a specific license program and the associated patents, visit the [Patent Map](https://aka.ms/AA9ufj8). 
- __Trademarks__. The names of companies and products contained in this documentation might be covered by trademarks or similar intellectual property rights. This notice does not grant any licenses under those rights. For a list of Microsoft trademarks, visit [www.microsoft.com/trademarks](https://www.microsoft.com/trademarks). 
- __Fictitious Names__. The example companies, organizations, products, domain names, email addresses, logos, people, places, and events that are depicted in this documentation are fictitious. No association with any real company, organization, product, domain name, email address, logo, person, place, or event is intended or should be inferred.

__Reservation of Rights__. All other rights are reserved, and this notice does not grant any rights other than as specifically described above, whether by implication, estoppel, or otherwise. 

__Tools__. The Open Specifications documentation does not require the use of Microsoft programming tools or programming environments in order for you to develop an implementation. If you have access to Microsoft programming tools and environments, you are free to take advantage of them. Certain Open Specifications documents are intended for use in conjunction with publicly available standards specifications and network programming art and, as such, assume that the reader either is familiar with the aforementioned material or has immediate access to it.

__Support.__ For questions and support, please contact [dochelp@microsoft.com](mailto:dochelp@microsoft.com). 

__Revision Summary__

Date

Revision History

Revision Class

Comments

1/20/2012

0.1

New

Released new document.

4/11/2012

0.1

None

No changes to the meaning, language, or formatting of the technical content.

7/16/2012

0.1

None

No changes to the meaning, language, or formatting of the technical content.

10/8/2012

1.0

Major

Significantly changed the technical content.

2/11/2013

1.0

None

No changes to the meaning, language, or formatting of the technical content.

7/30/2013

1.0

None

No changes to the meaning, language, or formatting of the technical content.

11/18/2013

1.0

None

No changes to the meaning, language, or formatting of the technical content.

2/10/2014

1.0

None

No changes to the meaning, language, or formatting of the technical content.

4/30/2014

1.1

Minor

Clarified the meaning of the technical content.

7/31/2014

1.1

None

No changes to the meaning, language, or formatting of the technical content.

10/30/2014

1.2

Minor

Clarified the meaning of the technical content.

9/4/2015

2.0

Major

Significantly changed the technical content.

7/15/2016

2.0

None

No changes to the meaning, language, or formatting of the technical content.

9/14/2016

2.0

None

No changes to the meaning, language, or formatting of the technical content.

4/18/2017

3.0

Major

Significantly changed the technical content.

4/27/2018

4.0

Major

Significantly changed the technical content.

8/28/2018

5.0

Major

Significantly changed the technical content.

12/11/2018

5.1

Minor

Clarified the meaning of the technical content.

3/19/2019

5.2

Minor

Clarified the meaning of the technical content.

11/19/2019

6.0

Major

Significantly changed the technical content.

2/19/2020

6.1

Minor

Clarified the meaning of the technical content.

4/22/2021

7.0

Major

Significantly changed the technical content.

5/5/2021

8.0

Major

Significantly changed the technical content.

8/17/2021

9.0

Major

Significantly changed the technical content.

4/16/2024

10.0

Major

Significantly changed the technical content.

8/20/2024

11.0

Major

Significantly changed the technical content.

Table of Contents

[1	Introduction	4](#_Toc174687692)

[1.1	Glossary	4](#_Toc174687693)

[1.2	References	4](#_Toc174687694)

[1.2.1	Normative References	4](#_Toc174687695)

[1.2.2	Informative References	5](#_Toc174687696)

[1.3	Overview	5](#_Toc174687697)

[1.3.1	Office Add-ins	5](#_Toc174687698)

[1.3.2	Content Extensions	5](#_Toc174687699)

[1.3.3	Task Pane Extensions	5](#_Toc174687700)

[1.4	Relationship to Protocols and Other Structures	5](#_Toc174687701)

[1.5	Applicability Statement	6](#_Toc174687702)

[1.6	Versioning and Localization	6](#_Toc174687703)

[1.7	Vendor-Extensible Fields	6](#_Toc174687704)

[2	Structures	7](#_Toc174687705)

[2.1	Global Elements	7](#_Toc174687706)

[2.1.1	webextension	7](#_Toc174687707)

[2.1.2	taskpanes	7](#_Toc174687708)

[2.1.3	webextensionref	7](#_Toc174687709)

[2.2	Complex Types	8](#_Toc174687710)

[2.2.1	CT_OsfWebExtensionProperty	8](#_Toc174687711)

[2.2.2	CT_OsfWebExtensionPropertyBag	8](#_Toc174687712)

[2.2.3	CT_OsfWebExtensionBinding	8](#_Toc174687713)

[2.2.4	CT_OsfWebExtensionBindingList	9](#_Toc174687714)

[2.2.5	CT_OsfWebExtensionReference	10](#_Toc174687715)

[2.2.6	CT_OsfWebExtensionReferenceList	11](#_Toc174687716)

[2.2.7	CT_OsfWebExtension	11](#_Toc174687717)

[2.2.8	CT_OsfTaskpane	12](#_Toc174687718)

[2.2.9	CT_OsfTaskpanes	13](#_Toc174687719)

[2.2.10	CT_WebExtensionPartRef	13](#_Toc174687720)

[2.2.11	CT_ContainsCustomFunctions	14](#_Toc174687721)

[2.2.12	CT_BackgroundAppData	14](#_Toc174687722)

[2.2.13	CT_CustomFunctionList	14](#_Toc174687723)

[3	Structure Examples	16](#_Toc174687724)

[3.1	Content Web Extension File	16](#_Toc174687725)

[3.2	Taskpane Web Extension File	16](#_Toc174687726)

[3.3	Content Web Extension File with Bindings	16](#_Toc174687727)

[4	Security	18](#_Toc174687728)

[4.1	Security Considerations for Implementers	18](#_Toc174687729)

[4.2	Index of Security Fields	18](#_Toc174687730)

[5	Appendix A: Full XML Schemas	19](#_Toc174687731)

[5.1	http://schemas.microsoft.com/office/webextensions/webextension/2010/11 Schema	19](#_Toc174687732)

[5.2	http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11 Schema	20](#_Toc174687733)

[6	Appendix B: Product Behavior	22](#_Toc174687734)

[7	Change Tracking	23](#_Toc174687735)

[8	Index	24](#_Toc174687736)

# <a id="section_7aac13305801483480bdfa383d55464b"></a><a id="_Toc174687692"></a>Introduction

The Office Web Extensibility Extensions to Office Open XML Structure specifies elements and attributes that extend the XML vocabulary for representing [__Office Add-ins__](#gt_8212530d-483d-4917-88bf-ab412b3dc178).

Sections 1.7 and 2 of this specification are normative. All other sections and examples in this specification are informative.

## <a id="section_959cb0cce7034131b3b1eeb00c86f01f"></a><a id="_Toc174687693"></a>Glossary

This document uses the following terms:

<a id="gt_3f2b5b54-7b39-4c73-9cbf-2dad50919ccd"></a>__catalog provider__: A program or function that processes requests to return manifests stored in the user's file system, document server and mailbox server. 

<a id="gt_7c4f81c3-2e19-4c95-ab8d-45721da01d26"></a>__JavaScript Object Notation (JSON)__: A text-based, data interchange format that is used to transmit structured data, typically in Asynchronous JavaScript + XML (AJAX) web applications, as described in [[RFC7159]](https://go.microsoft.com/fwlink/?linkid=842522). The JSON format is based on the structure of ECMAScript (Jscript, JavaScript) objects.

<a id="gt_8212530d-483d-4917-88bf-ab412b3dc178"></a>__Office Add-in__: A cloud-enabled app that integrates rich, scenario-focused content and services into an Office application or equivalent protocol client.

<a id="gt_6612e30f-4bf7-45e0-a99c-d15eeb1a1f0c"></a>__Task Pane__: A dockable dialog window that gives users a convenient way to execute commands, gather information, and modify their documents.

<a id="gt_6b0c6982-1354-4309-86eb-c4c4ae9d8bcb"></a>__web application__: A container in a configuration database that stores administrative settings and entry-point URLs for site collections. 

<a id="gt_982b7f8e-d516-4fd5-8d5e-1a836081ed85"></a>__XML__: The Extensible Markup Language, as described in [[XML1.0]](https://go.microsoft.com/fwlink/?LinkId=90599).

__MAY, SHOULD, MUST, SHOULD NOT, MUST NOT:__ These terms (in all caps) are used as defined in [[RFC2119]](https://go.microsoft.com/fwlink/?LinkId=90317). All statements of optional behavior use either MAY, SHOULD, or SHOULD NOT.

## <a id="section_d27111f6c39c40fc8ccf58ccfa33dec6"></a><a id="_Toc174687694"></a>References

Links to a document in the Microsoft Open Specifications library point to the correct section in the most recently published version of the referenced document. However, because individual documents in the library are not updated at the same time, the section numbers in the documents may not match. You can confirm the correct section numbering by checking the [Errata](https://go.microsoft.com/fwlink/?linkid=850906).  

### <a id="section_9cc0e848cf33487094634c4e8778dca8"></a><a id="_Toc174687695"></a>Normative References

We conduct frequent surveys of the normative references to assure their continued availability. If you have any issue with finding a normative reference, please contact [dochelp@microsoft.com](mailto:dochelp@microsoft.com). We will assist you in finding the relevant information. 

[ISO/IEC29500-1:2016] ISO/IEC, "Information technology -- Document description and processing languages -- Office Open XML File Formats -- Part 1: Fundamentals and Markup Language Reference", ISO/IEC 29500-1:2016, [https://www.iso.org/standard/71691.html](https://go.microsoft.com/fwlink/?linkid=861065)

[MS-OI29500] Microsoft Corporation, "[Office Implementation Information for ISO/IEC 29500 Standards Support](%5bMS-OI29500%5d.pdf#Section_1fd4a662862349c082f018fa91b413b8)".

[RFC2119] Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, March 1997, [https://www.rfc-editor.org/info/rfc2119](https://go.microsoft.com/fwlink/?LinkId=90317)

[XMLSCHEMA1/2] Thompson, H., Beech, D., Maloney, M., and Mendelsohn, N., Eds., "XML Schema Part 1: Structures Second Edition", W3C Recommendation, October 2004, [https://www.w3.org/TR/2004/REC-xmlschema-1-20041028/](https://go.microsoft.com/fwlink/?LinkId=90607)

[XMLSCHEMA2/2] Biron, P., and Malhotra, A., Eds., "XML Schema Part 2: Datatypes Second Edition", W3C Recommendation, October 2004, [https://www.w3.org/TR/2004/REC-xmlschema-2-20041028/](https://go.microsoft.com/fwlink/?LinkId=90609)

### <a id="section_66f970e5726d4ff5a18fc416028fef00"></a><a id="_Toc174687696"></a>Informative References

[ISO/IEC29500-4:2016] ISO/IEC, "Information technology -- Document description and processing languages -- Office Open XML File Formats -- Part 4: Transitional Migration Features", [https://www.iso.org/standard/71692.html](https://go.microsoft.com/fwlink/?linkid=861068)

[MS-DOCX] Microsoft Corporation, "[Word Extensions to the Office Open XML (.docx) File Format](%5bMS-DOCX%5d.pdf#Section_b839fe1fe1ca4fa68c265954d0abbccd)".

[MS-PPTX] Microsoft Corporation, "[PowerPoint (.pptx) Extensions to the Office Open XML File Format](%5bMS-PPTX%5d.pdf#Section_efd8bb2dd8884e2eaf25cad476730c9f)".

[MS-XLSX] Microsoft Corporation, "[Excel (.xlsx) Extensions to the Office Open XML SpreadsheetML File Format](%5bMS-XLSX%5d.pdf#Section_2c5dee00eff24b2292b60738acd4475e)".

[RFC4627] Crockford, D., "The application/json Media Type for JavaScript Object Notation (JSON)", RFC 4627, July 2006, [https://www.rfc-editor.org/info/rfc4627](https://go.microsoft.com/fwlink/?LinkId=140879)

## <a id="section_29f59f30b835461abd8aca400a7bc717"></a><a id="_Toc174687697"></a>Overview

The structures specified in this format provide the description of the [__XML__](#gt_982b7f8e-d516-4fd5-8d5e-1a836081ed85) representation of [__Office Add-ins__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) inside the document file formats of their host client applications. The elements and attributes specified in this format enable developers and end users to include Office Add-ins on either spreadsheet or word processing documents. The XML structures are used by the Office Add-in framework to activate Office Add-ins when a document is opened by an end user.

The following sections provide a base definition of how an Office Add-in is stored and additional syntax extensions to store two different types of Office Add-ins.

### <a id="section_5927ca7cb04e44888406971f357674ef"></a><a id="_Toc174687698"></a>Office Add-ins

The [__Office Add-ins__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) structure is required by the Office Add-in framework to activate Office Add-ins when a document is opened, regardless of the host application. It uniquely identifies the Office Add-in in the catalog where it is stored. 

### <a id="section_a7e0c2ace7444efd8eba78cf4b376034"></a><a id="_Toc174687699"></a>Content Extensions

A Content Extension specifies the storage of [__Office Add-ins__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) in document content, including the positioning of the Office Add-in within the document as well as its width and height dimensions.

### <a id="section_3dda332e7f0a45a3bcf55c2ac9d37f1f"></a><a id="_Toc174687700"></a>Task Pane Extensions

Task Pane Extensions specify the storage of [__Task Pane__](#gt_6612e30f-4bf7-45e0-a99c-d15eeb1a1f0c) extensions in either spreadsheet or word processing documents. They define the user interface positioning of the Task Pane in the document, its width and height dimensions, and whether it is floating or docked into the document.

## <a id="section_f92c1dd3f0ed4af98885baceb1d84307"></a><a id="_Toc174687701"></a>Relationship to Protocols and Other Structures

This file format is hosted within the structures that are defined in the following references:

- A word processing document file format, as described in [[MS-DOCX]](%5bMS-DOCX%5d.pdf#Section_b839fe1fe1ca4fa68c265954d0abbccd).
- A spreadsheet file format, as described in [[MS-XLSX]](%5bMS-XLSX%5d.pdf#Section_2c5dee00eff24b2292b60738acd4475e).
- A presentation file format, as described in [[MS-PPTX]](%5bMS-PPTX%5d.pdf#Section_efd8bb2dd8884e2eaf25cad476730c9f).

Custom settings are stored using the [__JavaScript Object Notation (JSON)__](#gt_7c4f81c3-2e19-4c95-ab8d-45721da01d26), as described in [[RFC4627]](https://go.microsoft.com/fwlink/?LinkId=140879).

## <a id="section_a984c46459364f4c900dab765fc14d03"></a><a id="_Toc174687702"></a>Applicability Statement

This structure is used to persist a file within a containing file, as described in [[MS-DOCX]](%5bMS-DOCX%5d.pdf#Section_b839fe1fe1ca4fa68c265954d0abbccd) or [[MS-XLSX]](%5bMS-XLSX%5d.pdf#Section_2c5dee00eff24b2292b60738acd4475e) or [[MS-PPTX]](%5bMS-PPTX%5d.pdf#Section_efd8bb2dd8884e2eaf25cad476730c9f). This structure applies to the case where a user inserts an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) within a session by using word processing or spreadsheet software that produces such a containing file.

## <a id="section_03f9f039bd2543dc90db6ba12bbbe00c"></a><a id="_Toc174687703"></a>Versioning and Localization

This document covers versioning issues in the following areas:

- __Structure versions:__ This document specifies version 1 for all structures defined in this document.
- __Localization:__ There are no localization issues.

## <a id="section_a99d9871f8b1470fbfc26cd0d4883135"></a><a id="_Toc174687704"></a>Vendor-Extensible Fields

None.

# <a id="section_e1129d8add3a433e9c2ee88a51adff71"></a><a id="_Toc174687705"></a>Structures

## <a id="section_b1ff8cf52cad4aa9901b0ef1ef43a3e6"></a><a id="_Toc174687706"></a>Global Elements

### <a id="section_56fe5a64dd6d422cbeac19d72dd10ade"></a><a id="_Toc174687707"></a>webextension

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

<a id="CC_5568cd65000000000000000000000000"></a>A __CT_OsfWebExtension__ element (section [2.2.7](#Section_d59d5543252a47dda5661503dbf6a233)) that specifies an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) document part [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="webextension" type="CT_OsfWebExtension"/>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_18ce23f8419e48408ae87b41a0aef827"></a><a id="_Toc174687708"></a>taskpanes

*Target namespace: *http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11

<a id="CC_384da522000000000000000000000000"></a>A __CT_OsfTaskpanes__ (section [2.2.9](#Section_3bc6c9f4154840dfaf01e9c801a0a237)) element that specifies a collection of [__Task Pane__](#gt_6612e30f-4bf7-45e0-a99c-d15eeb1a1f0c) [__Office Add-ins__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) relationships document part [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065). Each taskpane relationship references a Task Pane Office Add-in associated with the current document.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="taskpanes" type="CT_OsfTaskpanes"/>

See section [5.2](#Section_084678b6e1804609966b175e7a9eb31e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_f4cab8d889584824a319310dc3514059"></a><a id="_Toc174687709"></a>webextensionref

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

<a id="CC_a312c38b000000000000000000000000"></a>A __CT_WebExtensionPartRef__ element (section [2.2.10](#Section_d1cf44a9fd234a3f91dae0c9589e604e)) that specifies a container for a part relationship identifier that references an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) document part, as specified in [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="webextensionref" type="CT_WebExtensionPartRef"/>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

## <a id="section_e669a58dfa7b428e8efaabd52e16cebf"></a><a id="_Toc174687710"></a>Complex Types

### <a id="section_7011fb2bb6ed429faabcfc65f37b5ab8"></a><a id="_Toc174687711"></a>CT_OsfWebExtensionProperty

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[CT_OsfWebExtensionPropertyBag](#Section_9548c2c38c794b799f4eb799e8d40f49)

<a id="CC_eee94eac000000000000000000000000"></a>A complex type that specifies an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) custom property.

*Attributes:*

<a id="CC_8aba3374000000000000000000000000"></a>__name: __A string ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609)  section 3.2.1) attribute that specifies a custom property name.

<a id="CC_cd445727000000000000000000000000"></a>__value: __A string ([XMLSCHEMA2/2] section 3.2.1) attribute that specifies a custom property value.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtensionProperty">
2.   <xsd:attribute name="name" type="xsd:string" use="required"/>
3.   <xsd:attribute name="value" type="xsd:string" use="required"/>
4. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_9548c2c38c794b799f4eb799e8d40f49"></a><a id="_Toc174687712"></a>CT_OsfWebExtensionPropertyBag

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[CT_OsfWebExtension](#Section_d59d5543252a47dda5661503dbf6a233)

<a id="CC_93fe2c01000000000000000000000000"></a>This element specifies a set of [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) custom properties.

*Child Elements:*

<a id="CC_020f92aa000000000000000000000000"></a>__property: __A __CT_OsfWebExtensionProperty__ (section [2.2.1](#Section_7011fb2bb6ed429faabcfc65f37b5ab8)) element that specifies a single Office Add-in custom property.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtensionPropertyBag">
2.   <xsd:sequence>
3.     <xsd:element name="property" minOccurs="0" maxOccurs="unbounded" type="CT_OsfWebExtensionProperty"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_c77600ca483748bb87d694654f414535"></a><a id="_Toc174687713"></a>CT_OsfWebExtensionBinding

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[CT_OsfWebExtensionBindingList](#Section_4e550573e9cb45929131e17cfc660453)

<a id="CC_a057d214000000000000000000000000"></a>A complex type that specifies a binding relationship between an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) and the data in the document. 

*Child Elements:*

<a id="CC_f3eb6690000000000000000000000000"></a>__extLst: __A __CT_OfficeArtExtensionList__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section A.4.1) that specifies a list of extensions for an Office Add-in. This element MAY be ignored.

*Attributes:*

<a id="CC_1029b64a000000000000000000000000"></a>__id: __A string attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) that specifies the binding identifier.

<a id="CC_1d4ca641000000000000000000000000"></a>__type: __A string attribute ([XMLSCHEMA2/2] section 3.2.1) that specifies the binding type.

<a id="CC_6b78448c000000000000000000000000"></a>__appref: __A string attribute ([XMLSCHEMA2/2] section 3.2.1) that specifies the binding key used to map the binding entry in this list with the bound data in the document.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtensionBinding">
2.   <xsd:sequence>
3.     <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
4.   </xsd:sequence>
5.   <xsd:attribute name="id" type="xsd:string" use="required"/>
6.   <xsd:attribute name="type" type="xsd:string" use="required"/>
7.   <xsd:attribute name="appref" type="xsd:string" use="required"/>
8. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_4e550573e9cb45929131e17cfc660453"></a><a id="_Toc174687714"></a>CT_OsfWebExtensionBindingList

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[CT_OsfWebExtension](#Section_d59d5543252a47dda5661503dbf6a233)

<a id="CC_3ce85505000000000000000000000000"></a>This element specifies a list of [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) bindings.

*Child Elements:*

<a id="CC_1a435544000000000000000000000000"></a>__binding: __A __CT_OsfWebExtensionBinding __(section [2.2.3](#Section_c77600ca483748bb87d694654f414535)) element that specifies an Office Add-in binding.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtensionBindingList">
2.   <xsd:sequence>
3.     <xsd:element name="binding" minOccurs="0" maxOccurs="unbounded" type="CT_OsfWebExtensionBinding"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_d4081e0b571145deb7081dfa1b943ad1"></a><a id="_Toc174687715"></a>CT_OsfWebExtensionReference

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[CT_OsfWebExtensionReferenceList](#Section_cb8fc4aa8a8845ee9c783dc66be8a765), [CT_OsfWebExtension](#Section_d59d5543252a47dda5661503dbf6a233)

<a id="CC_e76ba3bc000000000000000000000000"></a>This element specifies the reference to an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178). The reference is used to identify the provider location and version of the extension.

*Child Elements:*

<a id="CC_4d3b64d0000000000000000000000000"></a>__extLst: __A __CT_OfficeArtExtensionList__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section A.4.1) that specifies a list of extensions for an Office Add-in. This element MAY be ignored.

*Attributes:*

<a id="CC_e3a33fa8000000000000000000000000"></a>__id: __A string attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) that specifies the identifier associated with the Office Add-in within a catalog provider. The identifier MUST be unique within a [__catalog provider__](#gt_3f2b5b54-7b39-4c73-9cbf-2dad50919ccd).

<a id="CC_34fba4d8000000000000000000000000"></a>__version: __A string attribute ([XMLSCHEMA2/2] section 3.2.1) that specifies the version of the Office Add-in.

<a id="CC_6878cdad000000000000000000000000"></a>__store: __A string attribute ([XMLSCHEMA2/2] section 3.2.1) that specifies the instance of the marketplace where the Office Add-in is stored.

<a id="CC_40a83d43000000000000000000000000"></a>__storeType: __A string attribute ([XMLSCHEMA2/2] section 3.2.1) that specifies the type of marketplace that the store attribute identifies. Default is "SPCatalog" (Corporate Catalog). The value MUST be in the following table:

Value

Meaning

OMEX

Specifies that the store type is Office.com.

SPCatalog

Specifies that the store type is SharePoint corporate catalog.

SPApp

Specifies that the store type is a SharePoint [__web application__](#gt_6b0c6982-1354-4309-86eb-c4c4ae9d8bcb).

Exchange

Specifies that the store type is an Exchange server.

FileSystem

Specifies that the store type is a file system share.

Registry

Specifies that the store type is the system registry.

ExCatalog

Specifies that the store type is Centralized Deployment via Exchange.

WOPICatalog

Specifies that the store type is a WOPI host.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtensionReference">
2.   <xsd:sequence>
3.     <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
4.   </xsd:sequence>
5.   <xsd:attribute name="id" type="xsd:string" use="required"/>
6.   <xsd:attribute name="version" type="xsd:string" use="required"/>
7.   <xsd:attribute name="store" type="xsd:string"/>
8.   <xsd:attribute name="storeType" type="xsd:string" use="optional"/>
9. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_cb8fc4aa8a8845ee9c783dc66be8a765"></a><a id="_Toc174687716"></a>CT_OsfWebExtensionReferenceList

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[CT_OsfWebExtension](#Section_d59d5543252a47dda5661503dbf6a233)

<a id="CC_bf34274a000000000000000000000000"></a>This element specifies a list of [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) references.

*Child Elements:*

<a id="CC_31e2421b000000000000000000000000"></a>__reference: __A __CT_OsfWebExtensionReference__ (section [2.2.5](#Section_d4081e0b571145deb7081dfa1b943ad1)) element that specifies an Office Add-in reference.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtensionReferenceList">
2.   <xsd:sequence>
3.     <xsd:element name="reference" minOccurs="0" maxOccurs="unbounded" type="CT_OsfWebExtensionReference"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_d59d5543252a47dda5661503dbf6a233"></a><a id="_Toc174687717"></a>CT_OsfWebExtension

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[webextension](#Section_56fe5a64dd6d422cbeac19d72dd10ade)

<a id="CC_b541ebdc000000000000000000000000"></a>This is the root element of an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178) document part.

*Child Elements:*

<a id="CC_2f3ce557000000000000000000000000"></a>__reference: __A __CT_OsfWebExtensionReference__ element (section [2.2.5](#Section_d4081e0b571145deb7081dfa1b943ad1)) that specifies the primary reference to an Office Add-in.

<a id="CC_9c82d287000000000000000000000000"></a>__alternateReferences: __A __CT_OsfWebExtensionReferenceList__ element (section [2.2.6](#Section_cb8fc4aa8a8845ee9c783dc66be8a765)) that specifies a list of __CT_OsfWebExtensionReference__ elements (section 2.2.5). The first of these __alternateReferences__ is used if the Office Add-in could not be located using the primary reference.

<a id="CC_8daf3283000000000000000000000000"></a>__properties: __A __CT_OsfWebExtensionPropertyBag__ element (section [2.2.2](#Section_9548c2c38c794b799f4eb799e8d40f49)) that contains a set of Office Add-in custom properties.

<a id="CC_0e9485db000000000000000000000000"></a>__bindings: __A __CT_OsfWebExtensionBindingList__ element (section [2.2.4](#Section_4e550573e9cb45929131e17cfc660453)) that specifies a list of Office Add-in bindings.

<a id="CC_143947d9000000000000000000000000"></a>__snapshot: __A __CT_Blip__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 20.1.8.13) that specifies a static image used to render the contents of the Office Add-in when it is not active. 

<a id="CC_65a94bb4000000000000000000000000"></a>__extLst: __A __CT_OfficeArtExtensionList__ element ([ISO/IEC29500-1:2016] section A.4.1) that specifies a list of extensions for an Office Add-in. This element MAY be ignored.

*Attributes:*

<a id="CC_8aaa9ac5000000000000000000000000"></a>__id: __A string attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1). This attribute uniquely identifies the Office Add-in instance in the current document.

<a id="CC_ecc2abd7000000000000000000000000"></a>__frozen: __A Boolean attribute ([XMLSCHEMA2/2] section 3.2.2) that specifies whether the user can interact with the Office Add-in or not.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfWebExtension">
2.   <xsd:sequence>
3.     <xsd:element name="reference" type="CT_OsfWebExtensionReference"/>
4.     <xsd:element name="alternateReferences" type="CT_OsfWebExtensionReferenceList" minOccurs="0" maxOccurs="1"/>
5.     <xsd:element name="properties" type="CT_OsfWebExtensionPropertyBag"/>
6.     <xsd:element name="bindings" type="CT_OsfWebExtensionBindingList"/>
7.     <xsd:element name="snapshot" type="a:CT_Blip" minOccurs="0" maxOccurs="1"/>
8.     <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
9.   </xsd:sequence>
10.   <xsd:attribute name="id" type="xsd:string" use="required"/>
11.   <xsd:attribute name="frozen" type="xsd:boolean" use="optional" default="false"/>
12. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_555d296828234cb3b3174511dfc97bef"></a><a id="_Toc174687718"></a>CT_OsfTaskpane

*Target namespace: *http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11

*Referenced by: *[CT_OsfTaskpanes](#Section_3bc6c9f4154840dfaf01e9c801a0a237)

<a id="CC_62814ff2000000000000000000000000"></a>A complex type that specifies a persisted taskpane object.

*Child Elements:*

<a id="CC_ea84a12e000000000000000000000000"></a>__webextensionref: __A __CT_WebExtensionPartRef__ element (section [2.2.10](#Section_d1cf44a9fd234a3f91dae0c9589e604e)) that specifies the container for a part relationship identifier that references the web extension part associated with the taskpane instance.__ __

<a id="CC_fe8ff2c9000000000000000000000000"></a>__extLst: __A __CT_OfficeArtExtensionList__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section A.4.1) that specifies a list of extensions for an [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178). This element MAY be ignored.

*Attributes:*

<a id="CC_6ab55565000000000000000000000000"></a>__dockstate: __A string attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) that specifies the last-docked location of this taskpane object__.__

<a id="CC_8daa3233000000000000000000000000"></a>__visibility: __A Boolean attribute ([XMLSCHEMA2/2] section 3.2.2) that specifies whether the [__Task Pane__](#gt_6612e30f-4bf7-45e0-a99c-d15eeb1a1f0c) shows as visible by default when the document opens.

<a id="CC_e6bc2aab000000000000000000000000"></a>__width: __A double attribute ([XMLSCHEMA2/2] section 3.2.5) that specifies the default width value for this taskpane instance__.__

<a id="CC_4bd2c25a000000000000000000000000"></a>__row: __An unsignedInt attribute ([XMLSCHEMA2/2] section 3.3.22) that specifies the index, enumerating from the outside to the inside, of this taskpane among other persisted taskpanes docked in the same default location__.__

<a id="CC_dd90509f000000000000000000000000"></a>__locked: __A Boolean attribute ([XMLSCHEMA2/2] section 3.2.2) that specifies whether the taskpane is locked to the document in the UI and cannot be closed by the user.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfTaskpane">
2.   <xsd:sequence>
3.     <xsd:element name="webextensionref" minOccurs="1" maxOccurs="1" type="we:CT_WebExtensionPartRef"/>
4.     <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6.   <xsd:attribute name="dockstate" type="xsd:string" use="required"/>
7.   <xsd:attribute name="visibility" type="xsd:boolean" use="required"/>
8.   <xsd:attribute name="width" type="xsd:double" use="required"/>
9.   <xsd:attribute name="row" type="xsd:unsignedInt" use="required"/>
10.   <xsd:attribute name="locked" type="xsd:boolean" use="optional" default="false"/>
11. </xsd:complexType>

See section [5.2](#Section_084678b6e1804609966b175e7a9eb31e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_3bc6c9f4154840dfaf01e9c801a0a237"></a><a id="_Toc174687719"></a>CT_OsfTaskpanes

*Target namespace: *http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11

*Referenced by: *[taskpanes](#Section_18ce23f8419e48408ae87b41a0aef827)

<a id="CC_e3d7901e000000000000000000000000"></a>A complex type that specifies a list of persisted taskpane objects__.__

*Child Elements:*

<a id="CC_9f33273b000000000000000000000000"></a>__taskpane: __A __CT_OsfTaskpane__ (section [2.2.8](#Section_555d296828234cb3b3174511dfc97bef)) element that specifies the information of a persisted taskpane object.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_OsfTaskpanes">
2.   <xsd:sequence>
3.     <xsd:element name="taskpane" minOccurs="0" maxOccurs="unbounded" type="CT_OsfTaskpane"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.2](#Section_084678b6e1804609966b175e7a9eb31e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_d1cf44a9fd234a3f91dae0c9589e604e"></a><a id="_Toc174687720"></a>CT_WebExtensionPartRef

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

*Referenced by: *[webextensionref](#Section_f4cab8d889584824a319310dc3514059), [CT_OsfTaskpane](#Section_555d296828234cb3b3174511dfc97bef)

<a id="CC_02fde075000000000000000000000000"></a>A complex type that specifies a container for a part relationship identifier that references a web extension part.

*Attributes:*

<a id="CC_2abc90bb000000000000000000000000"></a>__r:id: __An __ST_RelationshipId__ simple type ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 22.8.2.1, and [[MS-OI29500]](%5bMS-OI29500%5d.pdf#Section_1fd4a662862349c082f018fa91b413b8) section 2.1.1741) that specifies an identifier that references a web extension part.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_WebExtensionPartRef">
2.   <xsd:attribute ref="r:id" use="required"/>
3. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_8361aa6ceb8246c791c075a8399ee98d"></a><a id="_Toc174687721"></a>CT_ContainsCustomFunctions

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

<a id="CC_0a673f5b000000000000000000000000"></a>Flag indicating that the add-in contains custom functions that are used by the workbook__.__

*Attributes:*

<a id="CC_8da13765000000000000000000000000"></a>__val: __A boolean ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) attribute that specifies whether a custom function is used in a spreadsheet application__.__ 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ContainsCustomFunctions">
2.   <xsd:attribute name="val" type="xsd:boolean" use="optional" default="false"/>
3. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_c1d756d528684713a9641710f06b3cf2"></a><a id="_Toc174687722"></a>CT_BackgroundAppData

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

<a id="CC_d2e231bc000000000000000000000000"></a>A complex type that specifies the startup behavior for current runtime when document is opened for the [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178).

*Attributes:*

<a id="CC_735c23fc000000000000000000000000"></a>__state: __An int [[[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.3.17] attribute that specifies the startup state for the current runtime when document is opened for the Office Add-in.

<a id="CC_3ec5268e000000000000000000000000"></a>__runtimeId: __A string [[XMLSCHEMA2/2] section 3.2.1] attribute uniquely identifies the current runtime instance of the Office Add-in in the current document.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_BackgroundAppData">
2.   <xsd:attribute name="state" type="xsd:int" use="required"/>
3.   <xsd:attribute name="runtimeId" type="xsd:string" use="required"/>
4. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

### <a id="section_e29b79603eae4528bd3073508f4d2c0c"></a><a id="_Toc174687723"></a>CT_CustomFunctionList

*Target namespace: *http://schemas.microsoft.com/office/webextensions/webextension/2010/11

<a id="CC_f707bd7b000000000000000000000000"></a>This element specifies a list of custom functions of the [__Office Add-in__](#gt_8212530d-483d-4917-88bf-ab412b3dc178).

*Child Elements:*

<a id="CC_c37b485d000000000000000000000000"></a>__customFunctionIds: __A string [[[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1] element that identifies one custom function in the Office Add-in.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CustomFunctionList">
2.   <xsd:sequence>
3.     <xsd:element name="customFunctionIds" type="xsd:string" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

# <a id="section_50fe2380f80b4712a6126752b67164e3"></a><a id="_Toc174687724"></a>Structure Examples

## <a id="section_6ddbf09f37b44874be2bb6929d04810e"></a><a id="_Toc174687725"></a>Content Web Extension File

The following example shows the content of a web extension file, as specified in section [2.2.7](#Section_d59d5543252a47dda5661503dbf6a233).

1. <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
2. <we:webextension xmlns:we="http://schemas.microsoft.com/office/webextensions/webextension/2010/11" id="{B1C15FE4-84FA-4773-AD36-9EF5444C5A01}">
3.   <we:reference id="Example1" version="15.0" store="C:\Example" storeType="Filesystem"/>
4.   <we:alternateReferences>
5.     <we:reference id="Example1a" version="15.0" store="en-US" storeType="OMEX"/>
6.   </we:alternateReferences>
7.   <we:properties>
8.     <we:property name="Key2" value="Value2"/>
9.     <we:property name="Key1" value="Value1"/>
10.   </we:properties>
11.   <we:bindings/>
12.   <we:snapshot xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"/>
13. </we:webextension>

## <a id="section_3d04f8ce65f24dc3bafa636d0a7e41a1"></a><a id="_Toc174687726"></a>Taskpane Web Extension File

The following example shows the content of a taskpane web extension file, as specified in section [2.2.9](#Section_3bc6c9f4154840dfaf01e9c801a0a237).

1. <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
2. <wetp:taskpanes xmlns:wetp="http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11">
3.   <wetp:taskpane dockstate="right" visibility="1" width="408" row="0">
4.     <wetp:webextension xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="rId1"/>
5.     <wetp:float left="0" top="0" height="0"/>
6.   </wetp:taskpane>
7. </wetp:taskpanes>

## <a id="section_5b150f1759a14bec874e83d25ef6eec9"></a><a id="_Toc174687727"></a>Content Web Extension File with Bindings

The following example shows the content of a web extension file, as specified in section [2.2.7](#Section_d59d5543252a47dda5661503dbf6a233). The web extension contains a list of bindings into the corresponding spreadsheet.

1. <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
2. <we:webextension xmlns:we="http://schemas.microsoft.com/office/webextensions/webextension/2010/11" id="{B1C15FE4-84FA-4773-AD36-9EF5444C5A01}">
3.   <we:reference id="Example3" version="15.0" store="C:\Example" storeType="Filesystem"/>
4.   <we:alternateReferences>
5.     <we:reference id="Example3a" version="15.0" store="en-US" storeType="OMEX"/>
6.   </we:alternateReferences>
7.   <we:properties>
8.     <we:property name="Key2" value="Value2"/>
9.     <we:property name="Key1" value="Value1"/>
10.   </we:properties>
11.   <we:bindings>
12.     <we:binding id="Text1" type="text" appref="{F7BD8A22-7E90-447C-B879-339B25F88DF4}"/>
13.     <we:binding id="Matrix1" type="matrix" appref="{92A3EB09-CEED-4F1F-AC74-37A542BD14C4}"/>
14.     <we:binding id="Table1" type="table" appref="{7A5FEE27-09CD-490E-BB34-122D16E45477}"/>
15.   </we:bindings>
16.   <we:snapshot xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="rId1"/>
17. </we:webextension>

# <a id="section_4b229e089d9a4f24bd2d911cf8209ea2"></a><a id="_Toc174687728"></a>Security

## <a id="section_5e7e875d2b244dd0ae2955f04052b798"></a><a id="_Toc174687729"></a>Security Considerations for Implementers

None.

## <a id="section_787fe203ebb2468089816a268aade35a"></a><a id="_Toc174687730"></a>Index of Security Fields

None.

# <a id="section_0e273d4c157843dba5ebc24012f659f1"></a><a id="_Toc174687731"></a>Appendix A: Full XML Schemas

For ease of implementation, the following sections provide the full XML schema for this protocol. Any schema references to namespaces included in [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) refer specifically to the transitional schemas as described in [[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068).

Schema name

Section

http://schemas.microsoft.com/office/webextensions/webextension/2010/11

[5.1](#Section_d09bb963531a40d2afcc9ce14684a7f8)

http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11

[5.2](#Section_084678b6e1804609966b175e7a9eb31e)

## <a id="section_d09bb963531a40d2afcc9ce14684a7f8"></a><a id="_Toc174687732"></a>http://schemas.microsoft.com/office/webextensions/webextension/2010/11 Schema

1. <xsd:schema targetNamespace="http://schemas.microsoft.com/office/webextensions/webextension/2010/11" elementFormDefault="qualified" attributeFormDefault="unqualified" xmlns="http://schemas.microsoft.com/office/webextensions/webextension/2010/11" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:o="urn:schemas-microsoft-com:office:office">
2.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="oartbasetypes.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="oartspeffects.xsd"/>
4.   <xsd:import namespace="http://schemas.openxmlformats.org/officeDocument/2006/relationships" schemaLocation="orel.xsd"/>
5.   <xsd:complexType name="CT_WebExtensionPartRef">
6.     <xsd:attribute ref="r:id" use="required"/>
7.   </xsd:complexType>
8.   <xsd:complexType name="CT_OsfWebExtensionProperty">
9.     <xsd:attribute name="name" type="xsd:string" use="required"/>
10.     <xsd:attribute name="value" type="xsd:string" use="required"/>
11.   </xsd:complexType>
12.   <xsd:complexType name="CT_OsfWebExtensionPropertyBag">
13.     <xsd:sequence>
14.       <xsd:element name="property" minOccurs="0" maxOccurs="unbounded" type="CT_OsfWebExtensionProperty"/>
15.     </xsd:sequence>
16.   </xsd:complexType>
17.   <xsd:complexType name="CT_OsfWebExtensionBinding">
18.     <xsd:sequence>
19.       <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
20.     </xsd:sequence>
21.     <xsd:attribute name="id" type="xsd:string" use="required"/>
22.     <xsd:attribute name="type" type="xsd:string" use="required"/>
23.     <xsd:attribute name="appref" type="xsd:string" use="required"/>
24.   </xsd:complexType>
25.   <xsd:complexType name="CT_OsfWebExtensionBindingList">
26.     <xsd:sequence>
27.       <xsd:element name="binding" minOccurs="0" maxOccurs="unbounded" type="CT_OsfWebExtensionBinding"/>
28.     </xsd:sequence>
29.   </xsd:complexType>
30.   <xsd:complexType name="CT_OsfWebExtensionReference">
31.     <xsd:sequence>
32.       <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
33.     </xsd:sequence>
34.     <xsd:attribute name="id" type="xsd:string" use="required"/>
35.     <xsd:attribute name="version" type="xsd:string" use="required"/>
36.     <xsd:attribute name="store" type="xsd:string"/>
37.     <xsd:attribute name="storeType" type="xsd:string" use="optional"/>
38.   </xsd:complexType>
39.   <xsd:complexType name="CT_OsfWebExtensionReferenceList">
40.     <xsd:sequence>
41.       <xsd:element name="reference" minOccurs="0" maxOccurs="unbounded" type="CT_OsfWebExtensionReference"/>
42.     </xsd:sequence>
43.   </xsd:complexType>
44.   <xsd:complexType name="CT_ContainsCustomFunctions">
45.     <xsd:attribute name="val" type="xsd:boolean" use="optional" default="false"/>
46.   </xsd:complexType>
47.   <xsd:complexType name="CT_CustomFunctionList">
48.     <xsd:sequence>
49.       <xsd:element name="customFunctionIds" type="xsd:string" minOccurs="0" maxOccurs="unbounded"/>
50.     </xsd:sequence>
51.   </xsd:complexType>
52.   <xsd:complexType name="CT_BackgroundAppData">
53.     <xsd:attribute name="state" type="xsd:int" use="required"/>
54.     <xsd:attribute name="runtimeId" type="xsd:string" use="required"/>
55.   </xsd:complexType>
56.   <xsd:complexType name="CT_OsfWebExtension">
57.     <xsd:sequence>
58.       <xsd:element name="reference" type="CT_OsfWebExtensionReference"/>
59.       <xsd:element name="alternateReferences" type="CT_OsfWebExtensionReferenceList" minOccurs="0" maxOccurs="1"/>
60.       <xsd:element name="properties" type="CT_OsfWebExtensionPropertyBag"/>
61.       <xsd:element name="bindings" type="CT_OsfWebExtensionBindingList"/>
62.       <xsd:element name="snapshot" type="a:CT_Blip" minOccurs="0" maxOccurs="1"/>
63.       <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
64.     </xsd:sequence>
65.     <xsd:attribute name="id" type="xsd:string" use="required"/>
66.     <xsd:attribute name="frozen" type="xsd:boolean" use="optional" default="false"/>
67.   </xsd:complexType>
68.   <xsd:element name="webextension" type="CT_OsfWebExtension"/>
69.   <xsd:element name="webextensionref" type="CT_WebExtensionPartRef"/>
70. </xsd:schema>

## <a id="section_084678b6e1804609966b175e7a9eb31e"></a><a id="_Toc174687733"></a>http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11 Schema

1. <xsd:schema targetNamespace="http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11" elementFormDefault="qualified" attributeFormDefault="unqualified" xmlns="http://schemas.microsoft.com/office/webextensions/taskpanes/2010/11" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:we="http://schemas.microsoft.com/office/webextensions/webextension/2010/11" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.microsoft.com/office/webextensions/webextension/2010/11" schemaLocation="osfwebextension.xsd"/>
3.   <xsd:import namespace="http://schemas.openxmlformats.org/drawingml/2006/main" schemaLocation="oartbasetypes.xsd"/>
4.   <xsd:complexType name="CT_OsfTaskpane">
5.     <xsd:sequence>
6.       <xsd:element name="webextensionref" minOccurs="1" maxOccurs="1" type="we:CT_WebExtensionPartRef"/>
7.       <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
8.     </xsd:sequence>
9.     <xsd:attribute name="dockstate" type="xsd:string" use="required"/>
10.     <xsd:attribute name="visibility" type="xsd:boolean" use="required"/>
11.     <xsd:attribute name="width" type="xsd:double" use="required"/>
12.     <xsd:attribute name="row" type="xsd:unsignedInt" use="required"/>
13.     <xsd:attribute name="locked" type="xsd:boolean" use="optional" default="false"/>
14.   </xsd:complexType>
15.   <xsd:complexType name="CT_OsfTaskpanes">
16.     <xsd:sequence>
17.       <xsd:element name="taskpane" minOccurs="0" maxOccurs="unbounded" type="CT_OsfTaskpane"/>
18.     </xsd:sequence>
19.   </xsd:complexType>
20.   <xsd:element name="taskpanes" type="CT_OsfTaskpanes"/>
21. </xsd:schema>

# <a id="section_b6af9172a8674f309f8004bccb73caf4"></a><a id="_Toc174687734"></a>Appendix B: Product Behavior

The information in this specification is applicable to the following Microsoft products or supplemental software. References to product versions include updates to those products.

- Microsoft Excel 2013
- Microsoft PowerPoint 2013
- Microsoft Word 2013
- Microsoft Excel 2016
- Microsoft PowerPoint 2016
- Microsoft Word 2016
- Microsoft Excel 2019
- Microsoft PowerPoint 2019
- Microsoft Word 2019
- Microsoft Excel 2021
- Microsoft PowerPoint 2021
- Microsoft Word 2021
- Microsoft Word LTSC 2024
- Microsoft Excel LTSC 2024
- Microsoft PowerPoint LTSC 2024

Exceptions, if any, are noted in this section. If an update version, service pack or Knowledge Base (KB) number appears with a product name, the behavior changed in that update. The new behavior also applies to subsequent updates unless otherwise specified. If a product edition appears with the product version, behavior is different in that product edition.

Unless otherwise specified, any statement of optional behavior in this specification that is prescribed using the terms "SHOULD" or "SHOULD NOT" implies product behavior in accordance with the SHOULD or SHOULD NOT prescription. Unless otherwise specified, the term "MAY" implies that the product does not follow the prescription.

# <a id="section_aa7d2990fb234f62bb380ec81a1d578f"></a><a id="_Toc174687735"></a>Change Tracking

This section identifies changes that were made to this document since the last release. Changes are classified as Major, Minor, or None. 

The revision class __Major__ means that the technical content in the document was significantly revised. Major changes affect protocol interoperability or implementation. Examples of major changes are:

- A document revision that incorporates changes to interoperability requirements.
- A document revision that captures changes to protocol functionality.

The revision class __Minor__ means that the meaning of the technical content was clarified. Minor changes do not affect protocol interoperability or implementation. Examples of minor changes are updates to clarify ambiguity at the sentence, paragraph, or table level.

The revision class __None__ means that no new technical changes were introduced. Minor editorial and formatting changes may have been made, but the relevant technical content is identical to the last released version.

The changes made to this document are listed in the following table. For more information, please contact [dochelp@microsoft.com](mailto:dochelp@microsoft.com).

Section

Description

Revision class

[6](#Section_b6af9172a8674f309f8004bccb73caf4) Appendix B: Product Behavior

Updated list of supported products.

Major

# <a id="section_de4a5392df3745f0b045bc9a8be5860d"></a><a id="_Toc174687736"></a>Index

A

[Applicability](#section_a984c46459364f4c900dab765fc14d03) 6

C

[Change tracking](#section_aa7d2990fb234f62bb380ec81a1d578f) 23

[Content Web Extension File example](#section_6ddbf09f37b44874be2bb6929d04810e) 16

[Content Web Extension File with Bindings example](#section_5b150f1759a14bec874e83d25ef6eec9) 16

D

Details

   [complex types – CT_OsfTaskpane](#section_555d296828234cb3b3174511dfc97bef) 12

   complex types – CT_OsfTaskpanes ([section 2.2.9](#section_3bc6c9f4154840dfaf01e9c801a0a237) 13, [section 2.2.12](#section_c1d756d528684713a9641710f06b3cf2) 14)

   [complex types – CT_OsfWebExtension](#section_d59d5543252a47dda5661503dbf6a233) 11

   [complex types – CT_OsfWebExtensionBinding](#section_c77600ca483748bb87d694654f414535) 8

   complex types – CT_OsfWebExtensionBindingList ([section 2.2.4](#section_4e550573e9cb45929131e17cfc660453) 9, [section 2.2.13](#section_e29b79603eae4528bd3073508f4d2c0c) 14)

   [complex types – CT_OsfWebExtensionProperty](#section_7011fb2bb6ed429faabcfc65f37b5ab8) 8

   [complex types – CT_OsfWebExtensionPropertyBag](#section_9548c2c38c794b799f4eb799e8d40f49) 8

   [complex types – CT_OsfWebExtensionReference](#section_d4081e0b571145deb7081dfa1b943ad1) 10

   [complex types – CT_OsfWebExtensionReferenceList](#section_cb8fc4aa8a8845ee9c783dc66be8a765) 11

   [complex types – CT_WebExtensionPartRef](#section_d1cf44a9fd234a3f91dae0c9589e604e) 13

   [global elements - taskpanes](#section_18ce23f8419e48408ae87b41a0aef827) 7

   [global elements - webextension](#section_56fe5a64dd6d422cbeac19d72dd10ade) 7

   [global elements - webextensionref](#section_f4cab8d889584824a319310dc3514059) 7

E

Example

   [content web extension file](#section_6ddbf09f37b44874be2bb6929d04810e) 16

   [content web extension file with bindings](#section_5b150f1759a14bec874e83d25ef6eec9) 16

   [taskpane web extension file](#section_3d04f8ce65f24dc3bafa636d0a7e41a1) 16

Examples

   [Content Web Extension File](#section_6ddbf09f37b44874be2bb6929d04810e) 16

   [Content Web Extension File with Bindings](#section_5b150f1759a14bec874e83d25ef6eec9) 16

   [Taskpane Web Extension File](#section_3d04f8ce65f24dc3bafa636d0a7e41a1) 16

F

[Fields - security index](#section_787fe203ebb2468089816a268aade35a) 18

[Fields - vendor-extensible](#section_a99d9871f8b1470fbfc26cd0d4883135) 6

[Full XML schema](#section_0e273d4c157843dba5ebc24012f659f1) 19

G

[Glossary](#section_959cb0cce7034131b3b1eeb00c86f01f) 4

I

[Implementer - security considerations](#section_5e7e875d2b244dd0ae2955f04052b798) 18

[Index of security fields](#section_787fe203ebb2468089816a268aade35a) 18

[Informative references](#section_66f970e5726d4ff5a18fc416028fef00) 5

[Introduction](#section_7aac13305801483480bdfa383d55464b) 4

L

[Localization](#section_03f9f039bd2543dc90db6ba12bbbe00c) 6

N

[Normative references](#section_9cc0e848cf33487094634c4e8778dca8) 4

O

Overview

   [apps for Office](#section_5927ca7cb04e44888406971f357674ef) 5

   [content extensions](#section_a7e0c2ace7444efd8eba78cf4b376034) 5

   [task pane extensions](#section_3dda332e7f0a45a3bcf55c2ac9d37f1f) 5

[Overview (synopsis)](#section_29f59f30b835461abd8aca400a7bc717) 5

P

[Product behavior](#section_b6af9172a8674f309f8004bccb73caf4) 22

R

[References](#section_d27111f6c39c40fc8ccf58ccfa33dec6) 4

   [informative](#section_66f970e5726d4ff5a18fc416028fef00) 5

   [normative](#section_9cc0e848cf33487094634c4e8778dca8) 4

[Relationship to protocols and other structures](#section_f92c1dd3f0ed4af98885baceb1d84307) 5

S

Security

   [field index](#section_787fe203ebb2468089816a268aade35a) 18

   [implementer considerations](#section_5e7e875d2b244dd0ae2955f04052b798) 18

T

[Taskpane Web Extension File example](#section_3d04f8ce65f24dc3bafa636d0a7e41a1) 16

[Tracking changes](#section_aa7d2990fb234f62bb380ec81a1d578f) 23

V

[Vendor-extensible fields](#section_a99d9871f8b1470fbfc26cd0d4883135) 6

[Versioning](#section_03f9f039bd2543dc90db6ba12bbbe00c) 6

X

[XML schema](#section_0e273d4c157843dba5ebc24012f659f1) 19

<a id="EndOfDocument_ST"></a>

