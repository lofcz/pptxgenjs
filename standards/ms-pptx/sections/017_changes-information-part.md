<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Changes Information Part -->

### Changes Information Part


The following table specifies a new Changes Information part that can be stored in a PresentationML document.

Part Components

Value

Content type

application/vnd.ms-powerpoint.changesinfo+xml

Root namespace

http://schemas.microsoft.com/office/powerpoint/2013/main/command

Source relationship

http://schemas.microsoft.com/office/2016/11/relationships/changesInfo

An instance of a Changes Information part specifies a set of document edits included by a PresentationML document.

A package MUST contain zero or one Changes Information part. If it exists, that part MUST be the target of an implicit relationship from the Presentation part ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 13.3.6).

The root element for a part of this content type MUST be __chgInfo __(section [2.12.1.1](#Section_6eb2db2955b94a908e6167c644cc2398)).

A Changes Information part MUST be located within the package containing the relationships part (expressed syntactically, the __TargetMode__ attribute of the __Relationship__ element ([[ISO/IEC29500-2:2012]](https://go.microsoft.com/fwlink/?LinkID=330448) section 6.5.3.4) MUST be Internal.

A Changes Information part MUST NOT have implicit or explicit relationships to other parts specified in [ISO/IEC29500-1:2016] or this document.
