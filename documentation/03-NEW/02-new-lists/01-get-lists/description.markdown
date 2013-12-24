### Arguments
-------------
<dl>
  <dt>
    listids
  </dt>
  <dd>
    **optional**
    
    comma separated list of ids, if none are specified, this returns all lists.
  </dd>
  <dt>
    excludeMembers
  </dt>
  <dd>
    **optional**
    
    set to 'true' to not return list members, this is preferred as it is much faster and smaller.
  </dd>
  <dt>
    lastModified
  </dt>
  <dd>
    **optional**
    
    only returns lists modified since this date (represented as millis since epoch)
  </dd>
</dl>