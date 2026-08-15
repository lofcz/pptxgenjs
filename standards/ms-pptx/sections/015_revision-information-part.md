<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Revision Information Part -->

### Revision Information Part


The following table specifies a new Revision Information part that can be stored in a PresentationML document.

Part Components

Value

Content type

application/vnd.ms-powerpoint.revisioninfo+xml

Root namespace

http://schemas.microsoft.com/office/powerpoint/2015/10/main

Source relationship

http://schemas.microsoft.com/office/2015/10/relationships/revisionInfo

An instance of a Revision Information part specifies a set of revisions included by a PresentationML document.

A package MUST contain zero or one Revision Information part. If it exists, that part MUST be the target of an implicit relationship from the Presentation part ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 13.3.6).

The root element for a part of this content type MUST be __revInfo__ (section [2.7.1.1](#Section_2f9b9e78b54442858bcdf797766e3aea)).

A Revision Information part MUST be located within the package containing the relationships part (expressed syntactically, the __TargetMode__ attribute of the __Relationship__ element ([[ISO/IEC29500-2:2012]](https://go.microsoft.com/fwlink/?LinkID=330448) section 6.5.3.4) shall be Internal).

A Revision Information part MUST NOT have implicit or explicit relationships to other parts specified in [ISO/IEC29500-1:2016] or this document.
