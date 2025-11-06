<script lang="ts">
	import type { CalendarDate } from "@internationalized/date";

  import * as Card from "#/ui/card";

  let { user_id, dateRange }: { user_id: string; dateRange: { from: CalendarDate; to:CalendarDate;  } | undefined } = $props();
</script>

<div class="flex flex-col gap-2">
	<h1 class="text-3xl font-bold">Zeitübersicht</h1>
  <Card.Root class="max-w-[40rem]">
    <Card.Header>
      <Card.Title>
        Zeitübersicht von 
      </Card.Title>
    </Card.Header>
    <Card.Content>
      
    </Card.Content>
  </Card.Root>
	<div>
		<span> // </span>
	</div>
</div>
