# frozen_string_literal: true

require 'rubystats/fishers_exact_test'

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/table_encoder'
require './lib/type_extensions'

# rubocop:disable RSpec/DescribeClass

# jellyNamed: a jelly bean table that contains booleans and strings
RSpec.describe 'pHackingHetrogenous' do
  include Basics

  describe 'investigates the association between getting acne and consuming jelly beans of a particular color' do
    let(:raw_table_string) do
        "
        # | name       | get acne | red   | black | white | green | yellow | brown | orange | pink  | purple |
        # | ---------- | -------- | ----- | ----- | ----- | ----- | ------ | ----- | ------ | ----- | ------ |
        # | \"Emily\"    | true     | false | false | false | true  | false  | false | true   | false | false  |
        # | \"Jacob\"    | true     | false | true  | false | true  | true   | false | false  | false | false  |
        # | \"Emma\"     | false    | false | false | false | true  | false  | false | false  | true  | false  |
        # | \"Aidan\"    | false    | false | false | false | false | true   | false | false  | false | false  |
        # | \"Madison\"  | false    | false | false | false | false | true   | false | false  | true  | false  |
        # | \"Ethan\"    | true     | false | true  | false | false | false  | false | true   | true  | false  |
        # | \"Hannah\"   | false    | false | true  | false | false | false  | false | false  | true  | false  |
        # | \"Matthew\"  | true     | false | false | false | false | false  | true  | true   | false | false  |
        # | \"Hailey\"   | true     | false | false | false | false | false  | false | true   | false | false  |
        # | \"Nicholas\" | false    | true  | false | false | false | true   | true  | false  | true  | false  |
      "
    end

    let(:table) { TableEncoder.encode(raw_table_string) }
    
    context 'when happy path' do
      # https://en.wikipedia.org/wiki/Fisher%27s_exact_test
      let(:fisher_test) do
        lambda do |xs, ys|
          a = 0
          b = 0
          c = 0
          d = 0

          xs.each_with_index do |x, i|
            y = ys[i]
            a += 1 if !x && !y
            b += 1 if x && !y
            c += 1 if !x && y
            d += 1 if x && y
          end

          numerator = Float((a + b).factorial * (c + d).factorial * (a + c).factorial * (b + d).factorial)
          denominator = Float(a.factorial * b.factorial * c.factorial * d.factorial * (a + b + c + d).factorial)

          numerator / denominator
        end
      end

      # > pHacking =
      #     function(t):
      #     colAcne = getColumn(t, "get acne")
      #     jellyAnon = dropColumns(t, ["get acne"])
      #     for c in header(jellyAnon):
      #         colJB = getColumn(t, c)
      #         p = fisherTest(colAcne, colJB)
      #         if p < 0.05:
      #         println(
      #             "We found a link between " ++
      #             c ++ " jelly beans and acne (p < 0.05).")
      #         end
      #     end
      # > pHacking(dropColumns(jellyNamed, ["name"]))
      # We found a link between orange jelly beans and acne (p < 0.05).
      let(:p_hacking) do
        lambda do |t|
          col_acne = t.get_column_by_name('get acne')
          jelly_anon = Table.drop_columns(t, ['get acne'])

          header(jelly_anon).map do |h|
            c = h[:column_name]
            col_jb = jelly_anon.get_column_by_name(c)
            p = fisher_test.call(col_acne, col_jb)
            if p < 0.05
              c
            else
              nil
            end
          end.compact
        end
      end

      it 'returns the correct message' do
        expect(p_hacking.call(Table.drop_columns(table, ["name"]))).to eq(['orange'])
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
